export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: 'Portero' | 'Defensa' | 'Medio' | 'Delantero' | 'Jugador';
}

export interface Team {
  id: string;
  name: string;
  captain: string;
  color: string;
  emoji: string;
  players: Player[];
  yellowCards: number;
  redCards: number;
  createdAt: string;
}

export type MatchStatus = 'pending' | 'in_progress' | 'finished';

export interface Match {
  id: string;
  round: number; // Número de jornada/fecha
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  homeYellowCards?: number;
  awayYellowCards?: number;
  playedAt?: string;
  notes?: string;
}

export interface StandingsRow {
  position: number;
  teamId: string;
  teamName: string;
  teamColor: string;
  teamEmoji: string;
  pj: number; // Partidos Jugados
  pg: number; // Ganados
  pe: number; // Empatados
  pp: number; // Perdidos
  gf: number; // Goles a Favor
  gc: number; // Goles en Contra
  dg: number; // Diferencia de Goles (GF - GC)
  pts: number; // Puntos (PG*3 + PE*1)
  yellowCards: number;
  redCards: number;
  tieBreakerNote?: string;
}

export interface Tournament {
  id: string;
  name: string;
  organizer: string;
  section: string;
  matchDurationMinutes: number;
  teams: Team[];
  matches: Match[];
  createdAt: string;
  updatedAt: string;
}

export interface TieBreakerExplanation {
  teamsInvolved: string[];
  positionRange: string;
  stepByStepResolution: string[];
  winnerReason: string;
}

export interface FixtureEquilibriumRating {
  score: number;
  balanceAssessment: string;
  recommendationsForNextRounds: string[];
}

export interface ChampionScenario {
  teamName: string;
  scenario: string;
}

export interface AiAnalysisResult {
  overallSummary: string;
  leaderAnalysis: {
    teamName: string;
    reason: string;
  };
  tieBreakerExplanations: TieBreakerExplanation[];
  fixtureEquilibriumRating: FixtureEquilibriumRating;
  championScenarios: ChampionScenario[];
  mvpOrKeyFactor: string;
  isAiGenerated: boolean;
  source: string;
}
