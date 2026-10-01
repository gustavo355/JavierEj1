import { Team, Match, StandingsRow } from '../types/tournament';

export function calculateStandings(teams: Team[], matches: Match[]): StandingsRow[] {
  // Inicializar acumuladores por equipo
  const rowsMap = new Map<string, StandingsRow>();

  teams.forEach((team) => {
    rowsMap.set(team.id, {
      position: 0,
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      teamEmoji: team.emoji,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
      yellowCards: team.yellowCards || 0,
      redCards: team.redCards || 0,
    });
  });

  // Procesar partidos finalizados
  matches.forEach((m) => {
    if (m.status !== 'finished') return;

    const home = rowsMap.get(m.homeTeamId);
    const away = rowsMap.get(m.awayTeamId);

    if (!home || !away) return;

    home.pj += 1;
    away.pj += 1;

    home.gf += m.homeScore;
    home.gc += m.awayScore;
    away.gf += m.awayScore;
    away.gc += m.homeScore;

    if (m.homeYellowCards) home.yellowCards += m.homeYellowCards;
    if (m.awayYellowCards) away.yellowCards += m.awayYellowCards;

    if (m.homeScore > m.awayScore) {
      home.pg += 1;
      home.pts += 3;
      away.pp += 1;
    } else if (m.awayScore > m.homeScore) {
      away.pg += 1;
      away.pts += 3;
      home.pp += 1;
    } else {
      home.pe += 1;
      home.pts += 1;
      away.pe += 1;
      away.pts += 1;
    }
  });

  // Calcular diferencia de goles
  rowsMap.forEach((row) => {
    row.dg = row.gf - row.gc;
  });

  const list = Array.from(rowsMap.values());

  // Ordenamiento con criterios oficiales deportivos:
  // 1. Puntos
  // 2. Diferencia de goles (DG)
  // 3. Goles a favor (GF)
  // 4. Enfrentamiento directo entre ellos
  // 5. Fair Play (menos tarjetas amarillas/rojas)
  // 6. Alfabético
  list.sort((a, b) => {
    // 1. Puntos
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }

    // 2. Diferencia de goles
    if (b.dg !== a.dg) {
      return b.dg - a.dg;
    }

    // 3. Goles a favor
    if (b.gf !== a.gf) {
      return b.gf - a.gf;
    }

    // 4. Duelo directo entre a y b
    const directMatch = matches.find(
      (m) =>
        m.status === 'finished' &&
        ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
          (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId))
    );

    if (directMatch) {
      const aGoals = directMatch.homeTeamId === a.teamId ? directMatch.homeScore : directMatch.awayScore;
      const bGoals = directMatch.homeTeamId === b.teamId ? directMatch.homeScore : directMatch.awayScore;
      if (aGoals !== bGoals) {
        return bGoals - aGoals;
      }
    }

    // 5. Fair play (menos tarjetas)
    const aCardsWeight = a.yellowCards + a.redCards * 3;
    const bCardsWeight = b.yellowCards + b.redCards * 3;
    if (aCardsWeight !== bCardsWeight) {
      return aCardsWeight - bCardsWeight; // Menor cantidad es mejor
    }

    // 6. Alfabético
    return a.teamName.localeCompare(b.teamName);
  });

  // Asignar posiciones y notas de desempate
  list.forEach((item, index) => {
    item.position = index + 1;
    const prev = list[index - 1];
    const next = list[index + 1];

    if (prev && prev.pts === item.pts) {
      if (prev.dg > item.dg) {
        item.tieBreakerNote = `Desempate vs ${prev.teamName}: superado por Dif. de Goles (${prev.dg >= 0 ? '+' : ''}${prev.dg} vs ${item.dg >= 0 ? '+' : ''}${item.dg})`;
      } else if (prev.gf > item.gf) {
        item.tieBreakerNote = `Desempate vs ${prev.teamName}: superado por Goles a Favor (${prev.gf} vs ${item.gf})`;
      } else {
        item.tieBreakerNote = `Desempate vs ${prev.teamName}: resuelto por duelo directo o Fair Play`;
      }
    } else if (next && next.pts === item.pts) {
      if (item.dg > next.dg) {
        item.tieBreakerNote = `Desempate vs ${next.teamName}: lidera por Dif. de Goles (${item.dg >= 0 ? '+' : ''}${item.dg} vs ${next.dg >= 0 ? '+' : ''}${next.dg})`;
      } else if (item.gf > next.gf) {
        item.tieBreakerNote = `Desempate vs ${next.teamName}: lidera por Goles a Favor (${item.gf} vs ${next.gf})`;
      } else {
        item.tieBreakerNote = `Desempate vs ${next.teamName}: lidera por duelo directo o Fair Play`;
      }
    }
  });

  return list;
}
