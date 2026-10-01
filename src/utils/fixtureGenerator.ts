import { Team, Match } from '../types/tournament';

/**
 * Genera un calendario de partidos equilibrado Round-Robin (todos contra todos)
 * utilizando el algoritmo clásico de rotación (Sistema Berger).
 */
export function generateRoundRobinFixture(teams: Team[]): { matches: Match[]; byeNotes: { round: number; teamName: string }[] } {
  if (teams.length < 2) {
    return { matches: [], byeNotes: [] };
  }

  const teamList = [...teams];
  const isOdd = teamList.length % 2 !== 0;
  const dummyTeamId = '__BYE_TEAM__';

  if (isOdd) {
    teamList.push({
      id: dummyTeamId,
      name: 'DESCANSO',
      captain: '',
      color: '#6b7280',
      emoji: '☕',
      players: [],
      yellowCards: 0,
      redCards: 0,
      createdAt: new Date().toISOString(),
    });
  }

  const totalTeams = teamList.length;
  const totalRounds = totalTeams - 1;
  const matchesPerRound = totalTeams / 2;

  const matches: Match[] = [];
  const byeNotes: { round: number; teamName: string }[] = [];

  // Copia de IDs para rotación fija con el primer elemento
  const indices = teamList.map((_, i) => i);

  for (let round = 1; round <= totalRounds; round++) {
    for (let matchIdx = 0; matchIdx < matchesPerRound; matchIdx++) {
      const homeIdx = indices[matchIdx];
      const awayIdx = indices[totalTeams - 1 - matchIdx];

      const homeTeam = teamList[homeIdx];
      const awayTeam = teamList[awayIdx];

      // Si uno de los dos es el equipo fantasma, el otro descansa
      if (homeTeam.id === dummyTeamId) {
        byeNotes.push({ round, teamName: awayTeam.name });
        continue;
      }
      if (awayTeam.id === dummyTeamId) {
        byeNotes.push({ round, teamName: homeTeam.name });
        continue;
      }

      // Alternar localía en rondas pares/impares para balancear
      const isSwapped = (round + matchIdx) % 2 === 1 && matchIdx === 0;
      const actualHome = isSwapped ? awayTeam : homeTeam;
      const actualAway = isSwapped ? homeTeam : awayTeam;

      matches.push({
        id: `match_r${round}_m${matchIdx}_${actualHome.id}_vs_${actualAway.id}`,
        round,
        homeTeamId: actualHome.id,
        awayTeamId: actualAway.id,
        homeTeamName: actualHome.name,
        awayTeamName: actualAway.name,
        homeScore: 0,
        awayScore: 0,
        status: 'pending',
        homeYellowCards: 0,
        awayYellowCards: 0,
      });
    }

    // Rotar elementos dejando indices[0] fijo en su lugar
    const first = indices[0];
    const rest = indices.slice(1);
    const last = rest.pop()!;
    rest.unshift(last);
    indices.splice(0, indices.length, first, ...rest);
  }

  return { matches, byeNotes };
}
