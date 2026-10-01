import { Tournament } from '../types/tournament';

export const STORAGE_KEY = 'torneo_relampago_data_v1';
export const BACKUP_KEY_PREFIX = 'torneo_relampago_backup_';

/**
 * Guarda el estado del torneo en localStorage de forma segura con verificación.
 */
export function saveTournamentToStorage(tournament: Tournament): boolean {
  try {
    const payload = JSON.stringify({
      ...tournament,
      updatedAt: new Date().toISOString(),
    });
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
 * Recupera el torneo desde localStorage.
 */
export function loadTournamentFromStorage(): Tournament | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.teams)) {
      return parsed as Tournament;
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
  const cleanName = (tournament.name || 'torneo_relampago')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${cleanName}_respaldo_${dateStr}.json`;

  const blob = new Blob([JSON.stringify(tournament, null, 2)], {
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
 * Valida y procesa un texto JSON para restaurar un torneo.
 */
export function validateAndParseTournamentJson(jsonText: string): Tournament {
  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('El archivo no contiene un objeto JSON válido.');
  }
  if (!Array.isArray(parsed.teams)) {
    throw new Error('El archivo no contiene la lista obligatoria de equipos.');
  }
  if (!Array.isArray(parsed.matches)) {
    parsed.matches = [];
  }
  return parsed as Tournament;
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
