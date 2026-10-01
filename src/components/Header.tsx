import React from 'react';
import { Trophy, Sparkles, BookOpen, Database, RefreshCw, Calendar, Users, Flame } from 'lucide-react';
import { Tournament } from '../types/tournament';

interface HeaderProps {
  tournament: Tournament;
  onOpenAiAnalysis: () => void;
  onOpenDossier: () => void;
  onOpenDataModal: () => void;
  onQuickDemoLoad: () => void;
  isAiLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  tournament,
  onOpenAiAnalysis,
  onOpenDossier,
  onOpenDataModal,
  onQuickDemoLoad,
  isAiLoading,
}) => {
  const finishedMatches = tournament.matches.filter((m) => m.status === 'finished').length;
  const totalGoals = tournament.matches.reduce(
    (sum, m) => sum + (m.status === 'finished' ? m.homeScore + m.awayScore : 0),
    0
  );

  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      {/* Barra superior de identificación institucional y práctica */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-fuchsia-950 px-3 py-1.5 border-b border-cyan-500/30 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold tracking-wider">EJERCICIO 19 · TORNEO RELÁMPAGO</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">3.er Año · Software «B» · INDEL</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDossier}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 hover:text-cyan-100 font-mono text-xs transition"
              title="Ver bitácora de prompts, tarjeta anti-alucinación y evidencias de la práctica"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bitácora & Rúbrica (10%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cabecera principal con título deportivo y acciones primarias */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30 flex-shrink-0">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-['Chakra_Petch']">
                  {tournament.name || 'Torneo Relámpago'}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-semibold">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Organizador del recreo: <strong className="text-slate-200">{tournament.organizer}</strong> · {tournament.section}
              </p>
            </div>
          </div>

          {/* Botones de acción principales */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenAiAnalysis}
              disabled={isAiLoading || tournament.teams.length < 2}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Analizando con IA...' : '⚡ Sello IA: Desempates'}</span>
            </button>

            <button
              onClick={onOpenDataModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition"
              title="Exportar respaldo JSON, restaurar datos o reiniciar torneo"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Datos</span>
            </button>

            {tournament.teams.length === 0 && (
              <button
                onClick={onQuickDemoLoad}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-semibold transition"
                title="Cargar torneo demo de 4 equipos con partidos y tabla para prueba inmediata"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Cargar Demo Recreo</span>
              </button>
            )}
          </div>
        </div>

        {/* Tarjetas métricas rápidas de la mesa de control */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Equipos
            </span>
            <span className="text-white font-bold text-sm">{tournament.teams.length}</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Partidos
            </span>
            <span className="text-white font-bold text-sm">
              {finishedMatches}/{tournament.matches.length}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between min-w-0">
            <span className="text-slate-400 flex items-center gap-1.5 flex-shrink-0">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Goles
            </span>
            <span className="text-white font-bold text-sm truncate max-w-[90px] text-right font-mono" title={`${totalGoals} goles en el torneo`}>
              {totalGoals > 999 ? '999+' : totalGoals}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between">
            <span className="text-slate-400">Duración Recreo</span>
            <span className="text-cyan-300 font-bold text-sm">{tournament.matchDurationMinutes} min</span>
          </div>
        </div>
      </div>
    </header>
  );
};
