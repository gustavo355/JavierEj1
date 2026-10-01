import React, { useState } from 'react';
import { Calendar, Play, CheckCircle2, Clock, Plus, Minus, AlertTriangle, RefreshCw, Trophy, ShieldAlert } from 'lucide-react';
import { Match, Team, MatchStatus } from '../types/tournament';

interface FixtureViewerProps {
  matches: Match[];
  teams: Team[];
  onGenerateFixture: () => void;
  onUpdateMatchScore: (matchId: string, homeScore: number, awayScore: number, status: MatchStatus, homeCards?: number, awayCards?: number, notes?: string) => void;
  onResetMatches: () => void;
}

export const FixtureViewer: React.FC<FixtureViewerProps> = ({
  matches,
  teams,
  onGenerateFixture,
  onUpdateMatchScore,
  onResetMatches,
}) => {
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'finished' | 'pending'>('all');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  // Respuesta háptica en teléfonos móviles (M3)
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignorar si el navegador restringe vibración
      }
    }
  };

  // Estados temporales del editor de partido
  const [tempHomeScore, setTempHomeScore] = useState(0);
  const [tempAwayScore, setTempAwayScore] = useState(0);
  const [tempStatus, setTempStatus] = useState<MatchStatus>('finished');
  const [tempHomeCards, setTempHomeCards] = useState(0);
  const [tempAwayCards, setTempAwayCards] = useState(0);
  const [tempNotes, setTempNotes] = useState('');

  // Agrupar jornadas
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  const filteredMatches = matches
    .filter((m) => selectedRound === 'all' || m.round === selectedRound)
    .filter((m) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'finished') return m.status === 'finished';
      return m.status === 'pending' || m.status === 'in_progress';
    });

  const startEditMatch = (m: Match) => {
    setEditingMatchId(m.id);
    setTempHomeScore(m.homeScore);
    setTempAwayScore(m.awayScore);
    setTempStatus(m.status === 'pending' ? 'finished' : m.status);
    setTempHomeCards(m.homeYellowCards || 0);
    setTempAwayCards(m.awayYellowCards || 0);
    setTempNotes(m.notes || '');
  };

  const handleSaveMatch = (matchId: string) => {
    // M4 Validaciones defensivas: Limitar a rango válido (0 a 50 goles)
    const validHome = Math.min(50, Math.max(0, Math.floor(tempHomeScore || 0)));
    const validAway = Math.min(50, Math.max(0, Math.floor(tempAwayScore || 0)));
    const validHomeCards = Math.min(10, Math.max(0, Math.floor(tempHomeCards || 0)));
    const validAwayCards = Math.min(10, Math.max(0, Math.floor(tempAwayCards || 0)));

    onUpdateMatchScore(
      matchId,
      validHome,
      validAway,
      tempStatus,
      validHomeCards,
      validAwayCards,
      tempNotes.trim().slice(0, 80)
    );
    setEditingMatchId(null);
  };

  // Helper para buscar datos visuales del equipo
  const getTeamInfo = (teamId: string) => {
    return teams.find((t) => t.id === teamId) || { name: 'Equipo', color: '#6b7280', emoji: '⚽' };
  };

  return (
    <div className="space-y-6">
      {/* Barra de cabecera del calendario */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Chakra_Petch']">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Calendario de Partidos (Fixture)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Función 2: Sistema Round-Robin equilibrado. Ingresa los marcadores y la tabla se recalcula al instante.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {matches.length === 0 ? (
            <button
              onClick={onGenerateFixture}
              disabled={teams.length < 2}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generar Fixture Equilibrado</span>
            </button>
          ) : !confirmRegenerate ? (
            <button
              onClick={() => setConfirmRegenerate(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
              title="Regenerar calendario desde cero"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerar Fixture</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onGenerateFixture();
                  setConfirmRegenerate(false);
                }}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition"
              >
                <span>¿Reiniciar resultados?</span>
              </button>
              <button
                onClick={() => setConfirmRegenerate(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {teams.length < 2 && matches.length === 0 && (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-200">
            Se necesitan al menos 2 equipos para armar el calendario de partidos.
          </p>
          <p className="text-xs text-slate-400">
            Ve a la pestaña "Equipos" o carga los datos de demostración en el botón superior.
          </p>
        </div>
      )}

      {/* Selector de Jornada y Filtro de Estado (M3: Ergonomía Móvil) */}
      {rounds.length > 0 && (
        <div className="space-y-2">
          {/* Jornadas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => {
                triggerHaptic();
                setSelectedRound('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                selectedRound === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todas ({matches.length})
            </button>
            {rounds.map((r) => (
              <button
                key={r}
                onClick={() => {
                  triggerHaptic();
                  setSelectedRound(r);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  selectedRound === r
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Fecha {r}
              </button>
            ))}
          </div>

          {/* Subfiltro de estado */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Estado:</span>
            <button
              onClick={() => {
                triggerHaptic();
                setStatusFilter('all');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setStatusFilter('finished');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                statusFilter === 'finished'
                  ? 'bg-slate-800 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jugados ({matches.filter((m) => m.status === 'finished').length})
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setStatusFilter('pending');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition ${
                statusFilter === 'pending'
                  ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Por Jugar ({matches.filter((m) => m.status !== 'finished').length})
            </button>
          </div>
        </div>
      )}

      {/* Estado vacío cuando el filtro no arroja partidos */}
      {matches.length > 0 && filteredMatches.length === 0 && (
        <div className="text-center py-10 px-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-slate-300">
            No hay partidos con los filtros seleccionados
          </p>
          <p className="text-xs text-slate-500">
            Cambia la fecha o el estado seleccionado para ver más partidos.
          </p>
          <button
            onClick={() => {
              setSelectedRound('all');
              setStatusFilter('all');
            }}
            className="mt-2 text-xs font-mono text-cyan-400 underline underline-offset-4"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Grid de partidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => {
          const homeTeam = getTeamInfo(match.homeTeamId);
          const awayTeam = getTeamInfo(match.awayTeamId);
          const isEditing = editingMatchId === match.id;

          return (
            <div
              key={match.id}
              className={`bg-slate-900 border rounded-xl p-4 shadow-lg transition flex flex-col justify-between ${
                match.status === 'finished'
                  ? 'border-slate-800 hover:border-slate-700'
                  : match.status === 'in_progress'
                  ? 'border-amber-500/50 shadow-amber-500/10'
                  : 'border-cyan-500/20'
              }`}
            >
              {/* Cabecera del partido: Fecha y Estado */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                <span className="font-mono font-bold text-amber-400 tracking-wider">
                  FECHA {match.round}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                    match.status === 'finished'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : match.status === 'in_progress'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {match.status === 'finished' && <CheckCircle2 className="w-3 h-3" />}
                  {match.status === 'in_progress' && <Play className="w-3 h-3" />}
                  {match.status === 'pending' && <Clock className="w-3 h-3" />}
                  <span>
                    {match.status === 'finished'
                      ? 'Finalizado'
                      : match.status === 'in_progress'
                      ? 'En Juego'
                      : 'Por Jugar'}
                  </span>
                </span>
              </div>

              {/* Contenido principal: Marcador deportivo táctil protegido */}
              {!isEditing ? (
                <div className="py-4">
                  <div className="flex items-center justify-between gap-2 px-1">
                    {/* Local */}
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center justify-end gap-1.5 min-w-0">
                        <span className="font-bold text-white text-xs sm:text-sm font-['Chakra_Petch'] truncate block" title={match.homeTeamName}>
                          {match.homeTeamName}
                        </span>
                        <span className="text-xl flex-shrink-0">{homeTeam.emoji}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">LOCAL</span>
                    </div>

                    {/* Marcador central protegido contra desbordamiento */}
                    <div className="flex-shrink-0 mx-1">
                      <div className="inline-flex items-center justify-center min-w-[72px] px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono font-black text-base sm:text-lg text-white shadow-inner">
                        {match.status === 'pending' ? (
                          <span className="text-slate-500 text-xs sm:text-sm tracking-widest">VS</span>
                        ) : (
                          <span className="truncate">
                            {Math.min(50, Math.max(0, match.homeScore))} - {Math.min(50, Math.max(0, match.awayScore))}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visitante */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-start gap-1.5 min-w-0">
                        <span className="text-xl flex-shrink-0">{awayTeam.emoji}</span>
                        <span className="font-bold text-white text-xs sm:text-sm font-['Chakra_Petch'] truncate block" title={match.awayTeamName}>
                          {match.awayTeamName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">VISITANTE</span>
                    </div>
                  </div>

                  {/* Notas o incidencias */}
                  {match.notes && (
                    <p className="mt-2 text-center text-xs text-slate-400 italic">
                      "{match.notes}"
                    </p>
                  )}

                  {/* Tarjetas / Fair Play */}
                  {((match.homeYellowCards ?? 0) > 0 || (match.awayYellowCards ?? 0) > 0) && (
                    <div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-3 bg-amber-400 rounded-sm inline-block" />
                        {match.homeYellowCards} {match.homeTeamName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-3 bg-amber-400 rounded-sm inline-block" />
                        {match.awayYellowCards} {match.awayTeamName}
                      </span>
                    </div>
                  )}

                  {/* Botón rápido para registrar/editar resultado */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                    <button
                      onClick={() => startEditMatch(match)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold font-mono transition"
                    >
                      <span>{match.status === 'finished' ? 'Modificar Marcador' : 'Registrar Resultado'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Modo edición interactivo con botones ergonómicos + y - */
                <div className="py-3 space-y-4 animate-in fade-in-50">
                  <div className="text-center text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
                    Mesa de Control · Anotar Marcador
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {/* Goles Local */}
                    <div className="text-center space-y-1.5">
                      <div className="text-xs font-bold text-white truncate font-['Chakra_Petch']">
                        {match.homeTeamName}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setTempHomeScore((prev) => Math.max(0, prev - 1));
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={tempHomeScore}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setTempHomeScore(Math.min(50, Math.max(0, parseInt(digits, 10) || 0)));
                          }}
                          className="w-14 h-10 text-center text-xl sm:text-2xl font-black font-mono text-cyan-300 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setTempHomeScore((prev) => Math.min(50, prev + 1));
                          }}
                          className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tarjetas Amarillas Local (Fair Play) */}
                      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                        <span className="w-2.5 h-3 bg-amber-400 rounded-sm inline-block" />
                        <span>Amarillas:</span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={tempHomeCards}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setTempHomeCards(Math.min(10, Math.max(0, parseInt(digits, 10) || 0)));
                          }}
                          className="w-8 py-0.5 text-center bg-slate-900 border border-slate-700 rounded text-amber-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Goles Visitante */}
                    <div className="text-center space-y-1.5 border-l border-slate-800 pl-3">
                      <div className="text-xs font-bold text-white truncate font-['Chakra_Petch']">
                        {match.awayTeamName}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setTempAwayScore((prev) => Math.max(0, prev - 1));
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={tempAwayScore}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setTempAwayScore(Math.min(50, Math.max(0, parseInt(digits, 10) || 0)));
                          }}
                          className="w-14 h-10 text-center text-xl sm:text-2xl font-black font-mono text-cyan-300 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setTempAwayScore((prev) => Math.min(50, prev + 1));
                          }}
                          className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tarjetas Amarillas Visitante (Fair Play) */}
                      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                        <span className="w-2.5 h-3 bg-amber-400 rounded-sm inline-block" />
                        <span>Amarillas:</span>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={tempAwayCards}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                            setTempAwayCards(Math.min(10, Math.max(0, parseInt(digits, 10) || 0)));
                          }}
                          className="w-8 py-0.5 text-center bg-slate-900 border border-slate-700 rounded text-amber-300 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Estado del partido y notas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-mono">Estado</label>
                      <select
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value as MatchStatus)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="finished">Finalizado (Computa a la tabla)</option>
                        <option value="in_progress">En Juego (En disputa)</option>
                        <option value="pending">Pendiente (No jugado)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-mono">Nota de partido (opcional)</label>
                      <input
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Ej. Gol de tiro libre al min 14"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingMatchId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveMatch(match.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      Guardar y Recalcular Tabla
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
