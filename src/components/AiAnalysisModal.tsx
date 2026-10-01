import React, { useState } from 'react';
import { X, Sparkles, Scale, Trophy, CheckCircle, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { AiAnalysisResult } from '../types/tournament';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiAnalysisResult | null;
  isLoading: boolean;
  errorMessage: string | null;
  onReanalyze: () => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  errorMessage,
  onReanalyze,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    if (!analysis) return;

    const text = `🏆 *INFORME OFICIAL · TORNEO RELÁMPAGO DEL RECREO*
⚡ *Sello de Inteligencia Artificial (M5)*

📌 *Resumen de la Jornada:*
${analysis.overallSummary}

🥇 *Líder:* ${analysis.leaderAnalysis.teamName}
${analysis.leaderAnalysis.reason}

⚖️ *Criterios de Desempate Aplicados:*
${analysis.tieBreakerExplanations
  .map(
    (tb) => `• ${tb.positionRange} (${tb.teamsInvolved.join(' vs ')}):
  ${tb.stepByStepResolution.join('\n  ')}
  ➔ Resultado: ${tb.winnerReason}`
  )
  .join('\n\n')}

📊 *Equilibrio del Fixture:* ${analysis.fixtureEquilibriumRating.score}/10
${analysis.fixtureEquilibriumRating.balanceAssessment}

🔥 *Escenarios de Campeonato:*
${analysis.championScenarios.map((sc) => `• ${sc.teamName}: ${sc.scenario}`).join('\n')}

🌟 *Factor Clave:*
${analysis.mvpOrKeyFactor}

_Generado automáticamente con el motor deportivo de Torneo Relámpago_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-fuchsia-500/40 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95">
        {/* Cabecera del modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-fuchsia-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base sm:text-lg font-['Chakra_Petch']">
                  Sello de IA · Análisis de Desempates
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                  M5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {analysis?.source || 'Modelo: Gemini 3.8 Flash con salida estructurada JSON'}
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

        {/* Cuerpo del modal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-3 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mx-auto" />
              <p className="font-bold text-white font-['Chakra_Petch'] text-base">
                Procesando goles, fixture y criterios de desempate...
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Consultando motor de reglas oficiales y modelo de IA.
              </p>
            </div>
          )}

          {errorMessage && !isLoading && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Error en el procesamiento del análisis</span>
              </div>
              <p className="text-xs">{errorMessage}</p>
              <button
                onClick={onReanalyze}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar Análisis</span>
              </button>
            </div>
          )}

          {analysis && !isLoading && (
            <>
              {/* Resumen ejecutivo */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Resumen de la Jornada</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{analysis.overallSummary}</p>
              </div>

              {/* Análisis del líder */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                  <span>🥇 Situación del Líder:</span>
                  <span className="text-white font-['Chakra_Petch'] text-sm">
                    {analysis.leaderAnalysis.teamName}
                  </span>
                </div>
                <p className="text-slate-300">{analysis.leaderAnalysis.reason}</p>
              </div>

              {/* Explicación de desempates paso a paso (El núcleo del Sello de IA) */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm font-['Chakra_Petch'] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-fuchsia-400" />
                  <span>Criterios de Desempate Aplicados Paso a Paso</span>
                </h4>

                <div className="space-y-2.5">
                  {analysis.tieBreakerExplanations.map((tb, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {tb.positionRange}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Equipos: {tb.teamsInvolved.join(', ')}
                        </span>
                      </div>

                      <ul className="space-y-1 text-slate-300 font-mono text-xs">
                        {tb.stepByStepResolution.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">▸</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-slate-800/80 text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Resolución: {tb.winnerReason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluación del equilibrio del fixture */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    ⚖️ Equilibrio del Calendario Round-Robin
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold text-xs">
                    {analysis.fixtureEquilibriumRating.score} / 10
                  </span>
                </div>
                <p className="text-slate-300">{analysis.fixtureEquilibriumRating.balanceAssessment}</p>

                <div className="pt-2 border-t border-slate-800 text-xs space-y-1">
                  <span className="font-mono text-slate-400 block text-[10px] uppercase">
                    Recomendaciones para el recreo:
                  </span>
                  {analysis.fixtureEquilibriumRating.recommendationsForNextRounds.map((rec, rIdx) => (
                    <p key={rIdx} className="text-slate-400 flex items-center gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Escenarios de campeonato */}
              {analysis.championScenarios.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-sm font-['Chakra_Petch']">
                    🔥 Qué necesita cada equipo para campeonar
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysis.championScenarios.map((sc, scIdx) => (
                      <div
                        key={scIdx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                      >
                        <strong className="text-white font-['Chakra_Petch'] block mb-0.5">
                          {sc.teamName}
                        </strong>
                        <span className="text-slate-400">{sc.scenario}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Factor clave / MVP */}
              <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-500/30 rounded-xl text-xs text-slate-300">
                <strong className="text-fuchsia-300 block mb-1 font-mono uppercase text-[10px]">
                  🌟 Factor Determinante del Recreo:
                </strong>
                <span>{analysis.mvpOrKeyFactor}</span>
              </div>
            </>
          )}
        </div>

        {/* Pie del modal con acciones */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={onReanalyze}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar Análisis</span>
          </button>

          <div className="flex items-center gap-2">
            {analysis && (
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar Informe'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
