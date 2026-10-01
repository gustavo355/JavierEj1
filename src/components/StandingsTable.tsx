import React from 'react';
import { Trophy, Award, TrendingUp, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import { StandingsRow } from '../types/tournament';

interface StandingsTableProps {
  standings: StandingsRow[];
  onOpenAiAnalysis: () => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ standings, onOpenAiAnalysis }) => {
  if (standings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white font-['Chakra_Petch']">
          Tabla de Posiciones Vacía
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Inscribe equipos y genera el fixture para que la tabla comience a calcularse en tiempo real con cada gol del recreo.
        </p>
      </div>
    );
  }

  const leader = standings[0];
  const bestAttack = [...standings].sort((a, b) => b.gf - a.gf)[0];
  const bestDefense = [...standings].filter((s) => s.pj > 0).sort((a, b) => a.gc - b.gc)[0];

  return (
    <div className="space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Chakra_Petch']">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <span>Tabla de Posiciones Oficial</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Función 3: Recálculo automático con cada pitazo final. Criterios de desempate federados.
          </p>
        </div>

        <button
          onClick={onOpenAiAnalysis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-mono font-semibold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Explicar Desempates con IA</span>
        </button>
      </div>

      {/* Tabla con scroll horizontal optimizado para pantallas móviles */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3 text-center w-12">Pos</th>
                <th className="py-3 px-3">Equipo</th>
                <th className="py-3 px-2 text-center" title="Partidos Jugados">PJ</th>
                <th className="py-3 px-2 text-center" title="Partidos Ganados">PG</th>
                <th className="py-3 px-2 text-center" title="Partidos Empatados">PE</th>
                <th className="py-3 px-2 text-center" title="Partidos Perdidos">PP</th>
                <th className="py-3 px-2 text-center" title="Goles a Favor">GF</th>
                <th className="py-3 px-2 text-center" title="Goles en Contra">GC</th>
                <th className="py-3 px-2 text-center font-bold" title="Diferencia de Goles">DG</th>
                <th className="py-3 px-3 text-center font-black text-amber-300" title="Puntos Acumulados">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {standings.map((row, index) => {
                const isChampion = index === 0;
                const isRunnerUp = index === 1;

                return (
                  <tr
                    key={row.teamId}
                    className={`transition hover:bg-slate-800/40 ${
                      isChampion ? 'bg-cyan-950/20' : isRunnerUp ? 'bg-slate-800/20' : ''
                    }`}
                  >
                    {/* Posición con insignia */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center">
                        {isChampion ? (
                          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-yellow-500/20">
                            1°
                          </span>
                        ) : isRunnerUp ? (
                          <span className="w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center">
                            2°
                          </span>
                        ) : index === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center">
                            3°
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">{row.position}°</span>
                        )}
                      </div>
                    </td>

                    {/* Equipo y nota de desempate */}
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl flex-shrink-0">{row.teamEmoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm sm:text-base font-['Chakra_Petch'] truncate">
                              {row.teamName}
                            </span>
                            {isChampion && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                LÍDER
                              </span>
                            )}
                          </div>

                          {row.tieBreakerNote && (
                            <span className="block text-[10px] font-mono text-cyan-400/90 truncate mt-0.5" title={row.tieBreakerNote}>
                              ⚡ {row.tieBreakerNote}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Estadísticas */}
                    <td className="py-3 px-2 text-center text-slate-300 font-semibold">{row.pj}</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">{row.pg}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{row.pe}</td>
                    <td className="py-3 px-2 text-center text-rose-400">{row.pp}</td>
                    <td className="py-3 px-2 text-center text-slate-300">{row.gf}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{row.gc}</td>
                    <td
                      className={`py-3 px-2 text-center font-bold ${
                        row.dg > 0
                          ? 'text-emerald-400'
                          : row.dg < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {row.dg > 0 ? `+${row.dg}` : row.dg}
                    </td>

                    {/* Puntos destacados */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded bg-slate-950 border border-cyan-500/30 text-cyan-300 font-black text-sm sm:text-base shadow-sm">
                        {row.pts}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Criterios oficiales de desempate al pie de la tabla */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Regla de Desempate: 1° Puntos ➔ 2° Diferencia de Goles (DG) ➔ 3° Goles a Favor (GF) ➔ 4° Duelo Directo ➔ 5° Fair Play</span>
          </div>
          <span className="text-slate-500">Victoria = 3 pts | Empate = 1 pt</span>
        </div>
      </div>

      {/* Tarjetas de honor y estadísticas colectivas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {leader && (
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl flex-shrink-0">
              {leader.teamEmoji}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Líder en Puntos
              </div>
              <div className="font-bold text-white text-sm truncate font-['Chakra_Petch']">
                {leader.teamName}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {leader.pts} Puntos · DG {leader.dg >= 0 ? '+' : ''}{leader.dg}
              </div>
            </div>
          </div>
        )}

        {bestAttack && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Mejor Ataque
              </div>
              <div className="font-bold text-white text-sm truncate font-['Chakra_Petch']">
                {bestAttack.teamName}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {bestAttack.gf} Goles anotados
              </div>
            </div>
          </div>
        )}

        {bestDefense && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Valla Menos Batida
              </div>
              <div className="font-bold text-white text-sm truncate font-['Chakra_Petch']">
                {bestDefense.teamName}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {bestDefense.gc} Goles recibidos ({bestDefense.pj} PJ)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
