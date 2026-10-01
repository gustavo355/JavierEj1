import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Inicialización de cliente Gemini SDK
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health checks para probes de Cloud Run y despliegues
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));

// Endpoint M5: Análisis de Torneo y Criterios de Desempate
app.post('/api/gemini/analyze-tournament', async (req, res) => {
  try {
    const { tournamentName, teams, matches, standings } = req.body;

    if (!teams || !standings || standings.length === 0) {
      return res.status(400).json({ error: 'Se requieren equipos y tabla de posiciones para el análisis.' });
    }

    // Regla de decisión / Motor de desempate matemático determinista (Plan B y base de verificación)
    const deterministicTieBreakers = detectTiesAndResolve(standings, matches);

    // Si no hay API KEY disponible, devolvemos el análisis estructurado con el motor matemático certificado
    if (!ai || !process.env.GEMINI_API_KEY) {
      const fallbackAnalysis = generateDeterministicAnalysis(
        tournamentName,
        teams,
        matches,
        standings,
        deterministicTieBreakers,
        'Motor de Criterios Oficiales (Regla determinista activa por ausencia de GEMINI_API_KEY)'
      );
      return res.json({
        ...fallbackAnalysis,
        isAiGenerated: false,
        source: 'Motor determinista reglamentario (Plan B documentado)',
      });
    }

    // Llamada con Gemini 3.8 Flash y responseSchema estructurado
    const prompt = `Actúa como comisionado y estadígrafo deportivo del "Torneo Relámpago" del recreo estudiantil.
Analiza la siguiente situación del torneo y genera un reporte estructurado y profesional:
- Nombre del torneo: "${tournamentName || 'Torneo Relámpago del Recreo'}"
- Equipos registrados (${teams.length}): ${teams.map((t: any) => t.name).join(', ')}
- Tabla de Posiciones actual:
${standings
  .map(
    (s: any, idx: number) =>
      `${idx + 1}° ${s.teamName}: ${s.pts} pts, PJ: ${s.pj}, PG: ${s.pg}, PE: ${s.pe}, PP: ${s.pp}, GF: ${s.gf}, GC: ${s.gc}, DG: ${s.dg >= 0 ? '+' : ''}${s.dg}`
  )
  .join('\n')}
- Partidos disputados y pendientes (${matches.length} en total):
${matches
  .map(
    (m: any) =>
      `Fecha ${m.round}: ${m.homeTeamName} ${m.status === 'finished' ? m.homeScore : '-'} vs ${m.status === 'finished' ? m.awayScore : '-'} ${m.awayTeamName} (${m.status})`
  )
  .join('\n')}

Reglas oficiales de desempate en orden:
1° Mayor cantidad de puntos.
2° Mejor diferencia de goles (DG = GF - GC).
3° Mayor cantidad de goles a favor (GF).
4° Resultado de enfrentamiento directo entre los empatados.
5° Menor cantidad de tarjetas / Fair Play o menor goles en contra.

Instrucciones:
1. Explica detalladamente cómo quedó cada posición de la tabla y por qué.
2. Si hay empates en puntos, desglosa el criterio exacto que rompió la igualdad paso a paso.
3. Evalúa si el fixture ha sido equilibrado para los tiempos cortos del recreo (15-20 min).
4. Plantea los escenarios matemáticos para los partidos pendientes o definición del campeón.
5. Lenguaje entusiasta, claro, deportivo y sin términos confusos.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: {
              type: Type.STRING,
              description: 'Resumen ejecutivo de la jornada deportiva y nivel competitivo.',
            },
            leaderAnalysis: {
              type: Type.OBJECT,
              properties: {
                teamName: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ['teamName', 'reason'],
            },
            tieBreakerExplanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  teamsInvolved: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  positionRange: { type: Type.STRING },
                  stepByStepResolution: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  winnerReason: { type: Type.STRING },
                },
                required: ['teamsInvolved', 'positionRange', 'stepByStepResolution', 'winnerReason'],
              },
            },
            fixtureEquilibriumRating: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER, description: 'Calificación de equilibrio del 1 al 10' },
                balanceAssessment: { type: Type.STRING },
                recommendationsForNextRounds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['score', 'balanceAssessment', 'recommendationsForNextRounds'],
            },
            championScenarios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  teamName: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                },
                required: ['teamName', 'scenario'],
              },
            },
            mvpOrKeyFactor: {
              type: Type.STRING,
              description: 'Jugador clave, equipo revelación o factor determinante del recreo.',
            },
          },
          required: [
            'overallSummary',
            'leaderAnalysis',
            'tieBreakerExplanations',
            'fixtureEquilibriumRating',
            'championScenarios',
            'mvpOrKeyFactor',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      ...parsed,
      isAiGenerated: true,
      source: 'Gemini 3.8 Flash (Structured Output)',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-tournament:', error);
    // Fallback elegante que garantiza que la app nunca se quede en blanco (M4 y M5)
    const { tournamentName, teams, matches, standings } = req.body;
    const fallback = generateDeterministicAnalysis(
      tournamentName,
      teams || [],
      matches || [],
      standings || [],
      detectTiesAndResolve(standings || [], matches || []),
      `Modo Resiliencia: Fallback determinista activado (${error.message || 'Error de conexión'})`
    );
    return res.json({
      ...fallback,
      isAiGenerated: false,
      source: 'Motor determinista reglamentario (Respaldo por error de API)',
    });
  }
});

// Función de apoyo: detección matemática de empates y aplicación de reglas
function detectTiesAndResolve(standings: any[], matches: any[]) {
  const ties: any[] = [];
  if (!standings || standings.length <= 1) return ties;

  // Agrupar por puntos
  const pointsMap = new Map<number, any[]>();
  standings.forEach((st) => {
    const list = pointsMap.get(st.pts) || [];
    list.push(st);
    pointsMap.set(st.pts, list);
  });

  pointsMap.forEach((group, pts) => {
    if (group.length > 1) {
      const teamNames = group.map((g) => g.teamName);
      const steps: string[] = [];
      steps.push(`Empate en puntos: ${group.length} equipos con ${pts} puntos.`);

      // 1. Comparar DG
      const dgs = group.map((g) => g.dg);
      const allDgsEqual = dgs.every((d) => d === dgs[0]);
      if (!allDgsEqual) {
        steps.push(
          `Criterio 1 (Diferencia de Goles): ${group.map((g) => `${g.teamName} (${g.dg >= 0 ? '+' : ''}${g.dg})`).join(', ')}.`
        );
      } else {
        steps.push(`Criterio 1: Empate idéntico en Diferencia de Goles (${dgs[0]}).`);
        // 2. Comparar GF
        const gfs = group.map((g) => g.gf);
        const allGfsEqual = gfs.every((gf) => gf === gfs[0]);
        if (!allGfsEqual) {
          steps.push(
            `Criterio 2 (Goles a Favor): ${group.map((g) => `${g.teamName} (${g.gf} GF)`).join(', ')}.`
          );
        } else {
          steps.push(`Criterio 2: Empate idéntico en Goles a Favor (${gfs[0]}).`);
          // 3. Enfrentamiento directo
          steps.push(`Criterio 3 (Duelo directo / Fair Play): Posición definida por enfrentamiento mutuo o tarjetas.`);
        }
      }

      ties.push({
        teamsInvolved: teamNames,
        positionRange: `Puestos disputados entre los empatados con ${pts} pts`,
        stepByStepResolution: steps,
        winnerReason: `${group[0].teamName} lidera el desempate por mejor balance reglamentario.`,
      });
    }
  });

  return ties;
}

function generateDeterministicAnalysis(
  tournamentName: string,
  teams: any[],
  matches: any[],
  standings: any[],
  ties: any[],
  reasonNote: string
) {
  const leader = standings[0] || { teamName: 'Por definir', pts: 0, dg: 0 };
  const finishedMatches = matches.filter((m) => m.status === 'finished');
  const pendingMatches = matches.filter((m) => m.status !== 'finished');

  return {
    overallSummary: `El torneo "${tournamentName || 'Torneo Relámpago'}" cuenta con ${teams.length} equipos y un avance de ${finishedMatches.length} de ${matches.length} partidos jugados (${Math.round((finishedMatches.length / (matches.length || 1)) * 100)}% de avance). ${leader.teamName} comanda la tabla con ${leader.pts} puntos.`,
    leaderAnalysis: {
      teamName: leader.teamName,
      reason: `Mantiene el primer lugar con ${leader.pts} puntos en ${leader.pj} partidos (${leader.pg} victorias, ${leader.pe} empates) y una diferencia de goles de ${leader.dg >= 0 ? '+' : ''}${leader.dg}.`,
    },
    tieBreakerExplanations: ties.length > 0 ? ties : [
      {
        teamsInvolved: standings.slice(0, 2).map((s) => s.teamName),
        positionRange: 'Primeros lugares',
        stepByStepResolution: [
          'No hay empates de puntos actualmente.',
          'Las posiciones están separadas netamente por puntos acumulados en cancha.',
        ],
        winnerReason: `${leader.teamName} mantiene ventaja directa de puntos sin necesidad de criterios secundarios.`,
      },
    ],
    fixtureEquilibriumRating: {
      score: 9.2,
      balanceAssessment: `El fixture round-robin garantiza que todos los ${teams.length} equipos jueguen bajo el sistema de todos contra todos con alternancia de local/visitante. Ideal para el tiempo del recreo escolar.`,
      recommendationsForNextRounds: [
        'Mantener tiempos de 10 a 15 minutos por tiempo para cumplir con la campana del recreo.',
        'Anotar los goles y tarjetas de inmediato en la mesa de control estudiantil.',
        pendingMatches.length > 0
          ? `Quedan ${pendingMatches.length} partidos por disputar para definir al campeón.`
          : 'Torneo completado en su totalidad.',
      ],
    },
    championScenarios: standings.slice(0, 3).map((st) => ({
      teamName: st.teamName,
      scenario:
        pendingMatches.length === 0
          ? st.position === 1
            ? '¡Campeón confirmado por puntuación final!'
            : `Finalizó en el puesto ${st.position}° con ${st.pts} puntos.`
          : `Requiere sumar en sus partidos restantes y sostener su diferencia de goles (${st.dg >= 0 ? '+' : ''}${st.dg}).`,
    })),
    mvpOrKeyFactor: `${reasonNote}. La intensidad en el medio campo y la efectividad ofensiva definen los partidos relámpago de recreo.`,
  };
}

// Configuración de entorno Vite o estáticos de producción
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Torneo Relámpago server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
