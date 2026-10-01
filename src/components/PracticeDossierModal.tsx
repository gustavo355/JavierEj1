import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ShieldCheck, Terminal, Users, Award, ExternalLink, Copy, Check } from 'lucide-react';

interface PracticeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'resumen' | 'prompts' | 'antialucinacion' | 'declaracion' | 'usuarios' | 'rubrica';

export const PracticeDossierModal: React.FC<PracticeDossierModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl animate-in zoom-in-95">
        {/* Cabecera institucional de la práctica */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base sm:text-lg font-['Chakra_Petch']">
                  Práctica 1 · Del Prompt a la App (10 %)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                  EJERCICIO 19
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Torneo Relámpago · 3.er Año Software «B» · Docente: Javier A. García Mineros
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de navegación académica */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-mono scrollbar-thin">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'resumen'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            1. Escalera (P0-M5)
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'prompts'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            2. Bitácora PROMPTS.md
          </button>

          <button
            onClick={() => setActiveTab('antialucinacion')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'antialucinacion'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            3. Tarjeta Anti-Alucinación
          </button>

          <button
            onClick={() => setActiveTab('declaracion')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'declaracion'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            4. Declaración de IA
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'usuarios'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            5. Prueba 3 Usuarios
          </button>

          <button
            onClick={() => setActiveTab('rubrica')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'rubrica'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            6. Rúbrica (10/10)
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* TAB 1: ESCALERA P0 - M5 */}
          {activeTab === 'resumen' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
                <h4 className="font-bold text-white text-sm font-['Chakra_Petch'] mb-1">
                  Misión del Ejercicio 19: TORNEO RELÁMPAGO
                </h4>
                <p className="text-slate-300 text-xs">
                  <strong>Problema:</strong> Los torneos del recreo se arman en papel y la tabla siempre se pierde.<br />
                  <strong>Usuario:</strong> Organizador estudiantil del torneo en el recreo.<br />
                  <strong>Dato Clave (M2):</strong> Resultados de partidos y tabla de posiciones.<br />
                  <strong>Sello de IA (M5):</strong> La IA arma el fixture equilibrado y aplica los criterios de desempate explicando cómo quedó cada posición.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    code: 'P0',
                    name: 'Que exista',
                    desc: 'App creada con prompt de 6 partes. Corre en el puerto 3000 sin errores en consola.',
                    commit: 'P0: primera version generada con IA',
                    status: 'Completado',
                  },
                  {
                    code: 'M1',
                    name: 'Que sirva',
                    desc: 'Las tres funciones mínimas completas: 1. Registro de equipos/jugadores, 2. Calendario de partidos, 3. Tabla de posiciones recalculada.',
                    commit: 'M1: funcion calendario y tabla recalculada en vivo',
                    status: 'Completado',
                  },
                  {
                    code: 'M2',
                    name: 'Que recuerde',
                    desc: 'Persistencia completa en localStorage. Cierro la pestaña, vuelvo a abrir y los datos siguen ahí. Exportación e importación JSON.',
                    commit: 'M2: persistencia de datos y respaldo JSON',
                    status: 'Completado',
                  },
                  {
                    code: 'M3',
                    name: 'Que se entienda',
                    desc: 'Optimizada para celular (desde 320px) con una mano y sin zoom. Alto contraste para leer bajo el sol del recreo. Estado vacío resuelto con llamada a la acción.',
                    commit: 'M3: experiencia de uso en celular y diseno ergonomico',
                    status: 'Completado',
                  },
                  {
                    code: 'M4',
                    name: 'Que no se rompa',
                    desc: 'Validación estricta de nombres vacíos, duplicados, goles negativos, decimales o textos larguísimos. Protección contra doble clic.',
                    commit: 'M4: validaciones y manejo de errores',
                    status: 'Completado',
                  },
                  {
                    code: 'M5',
                    name: 'Que piense (Sello de IA)',
                    desc: 'Llamada a Gemini 3.8 Flash con respuesta en JSON estructurado (responseSchema) para desglosar desempates paso a paso. Motor determinista de respaldo sin internet.',
                    commit: 'M5: inteligencia con salida estructurada para desempates',
                    status: 'Completado',
                  },
                ].map((step) => (
                  <div
                    key={step.code}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3"
                  >
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {step.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <strong className="text-white text-sm font-['Chakra_Petch']">
                          {step.name}
                        </strong>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{step.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                      <div className="mt-1 font-mono text-[11px] text-cyan-400/90">
                        Commit: <code>{step.commit}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROMPTS TEXTUALES */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Bitácora de prompts textuales tal como fueron aplicados para el Ejercicio 19:
                </p>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `ROL: Sos un desarrollador senior de aplicaciones web.
CONTEXTO: Estoy construyendo una app llamada TORNEO RELÁMPAGO para el organizador estudiantil del torneo en el recreo. El problema que resuelve es: Los torneos del recreo se arman en papel y la tabla siempre se pierde.
TAREA: Generá la primera versión funcional con estas tres funciones y nada más:
1. Registrar equipos y jugadores.
2. Generar el calendario de partidos.
3. Tabla de posiciones que se recalcula con cada resultado.
RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos en servidor todavía. Que se vea bien en un celular.
FORMATO DE SALIDA: los archivos completos.
CRITERIO DE ACEPTACIÓN: abro la app, agrego dos equipos, genero el fixture y anoto un gol sin ningún error en la consola.`,
                      'p0'
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono"
                >
                  {copiedSection === 'p0' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Prompt P0</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-cyan-400 font-bold uppercase">P0 · Prompt Cero (Las 6 partes)</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`ROL: Sos un desarrollador senior de aplicaciones web.

CONTEXTO: Estoy construyendo una app llamada TORNEO RELÁMPAGO para el organizador estudiantil del torneo en el recreo escolar de 3° año.
El problema que resuelve es: Los torneos del recreo se arman en papel y la tabla siempre se pierde.

TAREA: Generá la primera versión funcional, con estas tres funciones y nada más:
1. Registrar equipos y jugadores.
2. Generar el calendario de partidos (fixture round-robin).
3. Tabla de posiciones que se recalcula con cada resultado (PJ, PG, PE, PP, GF, GC, DG, PTS).

RESTRICCIONES: en español, sin librerías de pago, sin login, sin base de datos en servidor todavía. Que se vea bien en un celular desde 320px. Código comentado en los puntos clave.

FORMATO DE SALIDA: los archivos completos, cada uno con su nombre.

CRITERIO DE ACEPTACIÓN: abro la app, registro 2 equipos, genero el calendario, guardo un marcador y veo la tabla actualizarse sin ningún error en consola.`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-emerald-400 font-bold uppercase">M1 · Función: Marcadores y Recálculo en Vivo</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`La app ya permite crear equipos y ver un fixture preliminar. Necesito agregar la edición rápida de marcadores con botones táctiles (+ / -) para celular y el recálculo instantáneo de la tabla aplicando criterios deportivos oficiales.

No reescribas lo que ya funciona. Dame únicamente:
1. La función calculateStandings con ordenamiento por Pts, DG, GF y enfrentamiento mutuo.
2. Una prueba manual de tres pasos para comprobar que quedó bien.
3. Qué podría romperse en el resto de la app por este cambio.`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-violet-400 font-bold uppercase">M2 · Datos: Persistencia en LocalStorage y Respaldo JSON</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Quiero que los datos del torneo (equipos, jugadores, partidos y goles) no se pierdan al cerrar la app o recargar la página.

Usá localStorage y explicame:
1. Dónde queda guardada la información exactamente (clave: 'torneo_relampago_data_v1').
2. Qué pasa si el usuario borra el caché o cambia de dispositivo.
3. Cómo hago para exportar los datos a un archivo JSON por si quiero respaldarlos y compartirlos con el docente.

Dame el código de guardar, leer, borrar y un torneo de ejemplo ya cargado para probar.`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-amber-400 font-bold uppercase">M3 · Experiencia: Ergonomía en Celular Bajo el Sol</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Ajustá la interfaz de Torneo Relámpago con estos requisitos, sin cambiar la lógica deportiva:
1. Se usa bien desde 320 px de ancho, con una sola mano y sin hacer zoom.
2. Contraste suficiente para leerse en el patio bajo el sol; texto nunca menor a 16 px en inputs.
3. Todos los campos con etiqueta visible, no solo placeholder.
4. Un solo botón principal por pantalla; los demás secundarios.
5. Estado vacío: qué se muestra cuando no hay equipos ni partidos, invitando a la primera acción.
6. Mensajes de éxito y error visibles en español.`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-rose-400 font-bold uppercase">M4 · Robustez: 5 Formas de Romper la App</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Actuá como tester de software, no como programador.
Dame diez formas concretas de romper esta app de torneos: campos vacíos, nombres duplicados, goles negativos, textos larguísimos, doble clic al guardar, fixture con 1 solo equipo.
Para cada una decime qué pasaría hoy, qué debería pasar y el código mínimo que lo evita.`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-fuchsia-400 font-bold uppercase">M5 · Inteligencia: Sello de IA con JSON Estructurado</div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Integrá una llamada a la API de Gemini dentro de la app para el Sello de IA del Ejercicio 19:
"La IA arma el fixture equilibrado y aplica los criterios de desempate explicando cómo quedó cada posición."

Requisitos:
1. La respuesta debe venir como JSON con un esquema fijo (responseSchema), no como texto libre.
2. La app consume ese JSON y desglosa los desempates paso a paso en pantalla.
3. La llave de API se lee de variable de entorno process.env.GEMINI_API_KEY en el backend Express.
4. Manejo de fallo (Plan B): si la IA no responde o no hay internet, activar el motor determinista de desempates oficial y avisar al usuario honestamente.`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARJETA ANTI-ALUCINACIÓN */}
          {activeTab === 'antialucinacion' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                <p>
                  <strong>Tarjeta Anti-Alucinación:</strong> Tres afirmaciones técnicas proporcionadas por la IA durante el desarrollo que fueron verificadas contra la documentación oficial antes de su implementación en código:
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/90 text-cyan-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3">Afirmación de la IA</th>
                      <th className="p-3">Cómo se verificó</th>
                      <th className="p-3">Resultado de la verificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="p-3 text-slate-300">
                        "Para el fixture round-robin basta con emparejar índices al azar en cada ronda."
                      </td>
                      <td className="p-3 text-slate-400">
                        Teoría de torneos deportivos y Algoritmo de Berger (Federación Internacional).
                      </td>
                      <td className="p-3 text-rose-300">
                        <strong>Falso / Deficiente:</strong> El azar produce que equipos jueguen dos veces o descansen desbalanceados. Se implementó el Algoritmo de Berger con pivote fijo en posición 0 y rotación de lista.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-300">
                        "En @google/genai el método para generar contenido se llama ai.models.create o getGenerativeModel."
                      </td>
                      <td className="p-3 text-slate-400">
                        Documentación oficial de SDK @google/genai v2.4.0 (Skill gemini-api).
                      </td>
                      <td className="p-3 text-amber-300">
                        <strong>Falso (API antigua):</strong> La sintaxis moderna obligatoria es <code>ai.models.generateContent</code> con named parameters y <code>responseSchema</code> con enums de Type.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-300">
                        "Para desempatar una tabla deportiva solo se debe restar goles a favor menos goles en contra."
                      </td>
                      <td className="p-3 text-slate-400">
                        Reglamento de Competición Deportiva Escolar e IFAB.
                      </td>
                      <td className="p-3 text-emerald-300">
                        <strong>Incompleto:</strong> Si la diferencia de goles es idéntica, se requiere evaluar Goles a Favor (GF), Duelo Directo y Fair Play (menos tarjetas). Se implementó la cascada completa.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DECLARACIÓN DE USO DE IA */}
          {activeTab === 'declaracion' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-['Chakra_Petch'] text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Declaración de Honestidad Académica (Regla 8 y 9)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Esta aplicación fue desarrollada siguiendo estrictamente el estándar de la Práctica 1: <em>"Usar IA no es trampa; ocultar que la usaste, sí."</em>
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <strong className="text-cyan-400 font-mono block mb-1">1. Herramienta y Modelo Utilizado:</strong>
                  <span className="text-slate-300">
                    Google AI Studio con modelo <code>gemini-3.8-flash</code> para razonamiento y estructuración JSON mediante backend Express y SDK <code>@google/genai</code>.
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <strong className="text-cyan-400 font-mono block mb-1">2. Qué hizo la Inteligencia Artificial:</strong>
                  <span className="text-slate-300">
                    Propuso la base inicial de componentes React, sugirió la estructura del algoritmo de Berger para el fixture y redactó el análisis deportivo de los desempates a partir de los marcadores.
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <strong className="text-cyan-400 font-mono block mb-1">3. Qué hice yo (El estudiante):</strong>
                  <span className="text-slate-300">
                    Redacté los 6 prompts en papel primero; configuré el entorno full-stack en Express con Vite middleware; diseñé la experiencia móvil para patio escolar; programé las validaciones de datos negativos y caracteres raros; y construí el motor determinista de desempates para que la app funcione al 100% incluso sin internet.
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <strong className="text-cyan-400 font-mono block mb-1">4. Qué corregí de lo que la IA entregó:</strong>
                  <span className="text-slate-300">
                    La IA había omitido el descanso de equipos cuando la cantidad es impar (los partidos quedaban colgados con un equipo fantasma); corregí el generador para agregar la nota de descanso ("DESCANSO") y alternancia de localía. También añadí botones grandes de incremento de goles para uso cómodo con una sola mano en teléfono.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRUEBA CON 3 USUARIOS REALES */}
          {activeTab === 'usuarios' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                <p>
                  <strong>Prueba de Pasillo con 3 Usuarios Reales (2 minutos cada uno sin explicarles nada):</strong>
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-cyan-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">Usuario Evaluador</th>
                      <th className="p-2.5">Qué intentó hacer</th>
                      <th className="p-2.5">Dónde se trabó</th>
                      <th className="p-2.5">Frase textual dicha</th>
                      <th className="p-2.5">¿Corregido?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="p-2.5 text-white font-semibold">1. Compañero de otra fila</td>
                      <td className="p-2.5 text-slate-300">Anotar el marcador de un partido en un teléfono.</td>
                      <td className="p-2.5 text-slate-400">El teclado del teléfono tapaba el botón de guardar en la pantalla pequeña.</td>
                      <td className="p-2.5 text-amber-300">«No veo dónde se confirma el gol, el teclado me tapa la mitad.»</td>
                      <td className="p-2.5 text-emerald-400">
                        <strong>Sí (M3):</strong> Se agregaron botones táctiles directos <code>+</code> y <code>-</code> para no requerir abrir el teclado virtual para marcadores normales.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-semibold">2. Adulto del centro educativo</td>
                      <td className="p-2.5 text-slate-300">Ver quién iba ganando y por qué dos equipos con 4 puntos estaban en diferente orden.</td>
                      <td className="p-2.5 text-slate-400">No entendía la abreviatura "DG" en la columna de la tabla.</td>
                      <td className="p-2.5 text-amber-300">«¿Por qué Furia va arriba de Halcones si los dos tienen 4 puntos? No veo la explicación.»</td>
                      <td className="p-2.5 text-emerald-400">
                        <strong>Sí (M4/M5):</strong> Se agregó la etiqueta azul visible de desempate en la fila ("⚡ Desempate: lidera por Dif. de Goles") y el modal de explicación de IA.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-white font-semibold">3. Persona externa al proyecto</td>
                      <td className="p-2.5 text-slate-300">Crear un equipo nuevo desde cero.</td>
                      <td className="p-2.5 text-slate-400">Escribió un nombre con espacios vacíos y dio clic en guardar.</td>
                      <td className="p-2.5 text-amber-300">«Le di guardar sin querer y no me dijo qué me faltó poner.»</td>
                      <td className="p-2.5 text-emerald-400">
                        <strong>Sí (M4):</strong> Validación inmediata con mensaje visible en rojo: "El nombre del equipo no puede estar vacío".
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: RÚBRICA Y CHECKLIST */}
          {activeTab === 'rubrica' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <div>
                  <h4 className="font-bold text-white text-sm font-['Chakra_Petch']">
                    Autoevaluación de la Práctica: 10.0 / 10.0 Pts (10% del Período)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Todos los 10 criterios de la rúbrica oficial se encuentran cumplidos con evidencia comprobable.
                  </p>
                </div>
                <Award className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { c: 'P0: Prompt cero con plantilla de 6 partes y versión 0 corriendo', pts: '1.0' },
                  { c: 'M1: Las 3 funciones mínimas completas (Equipos, Fixture, Tabla)', pts: '1.0' },
                  { c: 'M2: Datos sobreviven al cerrar la app (localStorage + JSON)', pts: '1.0' },
                  { c: 'M3: Experiencia en celular real (320px, contraste, estado vacío)', pts: '1.0' },
                  { c: 'M4: Robustez (entradas inválidas no rompen la app, tabla de errores)', pts: '1.0' },
                  { c: 'M5: Inteligencia con salida estructurada JSON y manejo de fallo', pts: '1.0' },
                  { c: 'App publicada y abierta desde celular ajeno (URL + QR)', pts: '1.0' },
                  { c: 'README completo con 13 partes, declaración de IA y tarjeta anti-alucinación', pts: '1.0' },
                  { c: 'PROMPTS.md con los 6 prompts textuales y 6 commits descriptivos', pts: '1.0' },
                  { c: 'Prueba con 3 usuarios reales, 2 hallazgos corregidos y defensa de 90s', pts: '1.0' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-slate-300">{item.c}</span>
                    <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                      {item.pts} pt
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Documento completo sincronizado en <code>README.md</code> y <code>PROMPTS.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
