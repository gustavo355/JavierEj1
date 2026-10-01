import { Tournament } from '../types/tournament';

export const STORAGE_KEY = 'torneo_relampago_data_v1';
export const BACKUP_KEY_PREFIX = 'torneo_relampago_backup_';

/**
 * Normaliza y sanea defensivamente todos los datos del torneo (M4: Que no se rompa).
 * Evita desbordamientos de enteros, textos infinitos, etiquetas HTML y valores NaN/nulos.
 */
export function sanitizeTournamentData(data: any): Tournament {
  if (!data || typeof data !== 'object') {
    throw new Error('Estructura de datos inválida.');
  }

  const teams = Array.isArray(data.teams)
    ? data.teams.map((t: any, index: number) => ({
        id: String(t.id || `team_${index}_${Date.now()}`),
        name: String(t.name || `Equipo ${index + 1}`).replace(/[<>]/g, '').trim().slice(0, 30),
        captain: t.captain ? String(t.captain).replace(/[<>]/g, '').trim().slice(0, 35) : undefined,
        color: typeof t.color === 'string' && t.color.startsWith('#') ? t.color.slice(0, 7) : '#06b6d4',
        emoji: typeof t.emoji === 'string' ? t.emoji.slice(0, 4) : '⚽',
        players: Array.isArray(t.players)
          ? t.players.map((p: any, pIndex: number) => ({
              id: String(p.id || `p_${pIndex}_${Date.now()}`),
              name: String(p.name || 'Jugador').replace(/[<>]/g, '').trim().slice(0, 30),
              number: Math.min(99, Math.max(1, Math.floor(Number(p.number) || 1))),
              position: p.position ? String(p.position).slice(0, 20) : undefined,
            }))
          : [],
      }))
    : [];

  const matches = Array.isArray(data.matches)
    ? data.matches.map((m: any, mIndex: number) => ({
        id: String(m.id || `match_${mIndex}_${Date.now()}`),
        round: Math.max(1, Math.floor(Number(m.round) || 1)),
        homeTeamId: String(m.homeTeamId || ''),
        awayTeamId: String(m.awayTeamId || ''),
        homeTeamName: String(m.homeTeamName || 'Local').slice(0, 30),
        awayTeamName: String(m.awayTeamName || 'Visitante').slice(0, 30),
        // M4: Límite estricto de goles por partido escolar (0 a 50) para evitar desbordes visuales
        homeScore: Math.min(50, Math.max(0, Math.floor(Number(m.homeScore) || 0))),
        awayScore: Math.min(50, Math.max(0, Math.floor(Number(m.awayScore) || 0))),
        status: m.status === 'finished' || m.status === 'in_progress' ? m.status : 'pending',
        homeYellowCards: Math.min(10, Math.max(0, Math.floor(Number(m.homeYellowCards) || 0))),
        awayYellowCards: Math.min(10, Math.max(0, Math.floor(Number(m.awayYellowCards) || 0))),
        notes: m.notes ? String(m.notes).replace(/[<>]/g, '').trim().slice(0, 80) : undefined,
        playedAt: m.playedAt ? String(m.playedAt) : undefined,
      }))
    : [];

  return {
    id: String(data.id || `torneo_${Date.now()}`),
    name: String(data.name || 'Torneo Relámpago del Recreo').replace(/[<>]/g, '').trim().slice(0, 45),
    organizer: String(data.organizer || 'Comité Deportivo').replace(/[<>]/g, '').trim().slice(0, 45),
    section: String(data.section || '3.er año · Software «B»').replace(/[<>]/g, '').trim().slice(0, 40),
    matchDurationMinutes: Math.min(90, Math.max(5, Math.floor(Number(data.matchDurationMinutes) || 15))),
    teams,
    matches,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Guarda el estado del torneo en localStorage de forma segura con verificación.
 */
export function saveTournamentToStorage(tournament: Tournament): boolean {
  try {
    const sanitized = sanitizeTournamentData(tournament);
    const payload = JSON.stringify(sanitized);
    localStorage.setItem(STORAGE_KEY, payload);

    // Snapshot histórico de seguridad
    const dateStamp = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`${BACKUP_KEY_PREFIX}${dateStamp}`, payload);
    return true;
  } catch (error) {
    console.error('Error al persistir en localStorage:', error);
    return false;
  }
}

/**
 * Recupera el torneo desde localStorage con saneamiento defensivo automático.
 */
export function loadTournamentFromStorage(): Tournament | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.teams)) {
      return sanitizeTournamentData(parsed);
    }
  } catch (error) {
    console.error('Error al cargar desde localStorage:', error);
  }
  return null;
}

/**
 * Exporta el torneo a un archivo .json descargable en el dispositivo.
 */
export function exportTournamentToJson(tournament: Tournament): void {
  const sanitized = sanitizeTournamentData(tournament);
  const cleanName = (sanitized.name || 'torneo_relampago')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${cleanName}_respaldo_${dateStr}.json`;

  const blob = new Blob([JSON.stringify(sanitized, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Valida y procesa un texto JSON para restaurar un torneo de forma segura.
 */
export function validateAndParseTournamentJson(jsonText: string): Tournament {
  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('El archivo no contiene un objeto JSON válido.');
  }
  if (!Array.isArray(parsed.teams)) {
    throw new Error('El archivo no contiene la lista obligatoria de equipos.');
  }
  return sanitizeTournamentData(parsed);
}

/**
 * Obtiene métricas del almacenamiento local para el usuario.
 */
export function getStorageMetrics(): { bytes: number; lastSaved: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bytes: 0, lastSaved: null };
    const parsed = JSON.parse(raw);
    return {
      bytes: new Blob([raw]).size,
      lastSaved: parsed.updatedAt || null,
    };
  } catch {
    return { bytes: 0, lastSaved: null };
  }
}
