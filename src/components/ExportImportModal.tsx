import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Trash2, Check, AlertCircle, FileJson, HardDrive } from 'lucide-react';
import { Tournament } from '../types/tournament';
import { exportTournamentToJson, validateAndParseTournamentJson, getStorageMetrics } from '../utils/storageHelper';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament;
  onImportTournament: (importedData: Tournament) => void;
  onLoadSampleData: () => void;
  onResetTournament: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  tournament,
  onImportTournament,
  onLoadSampleData,
  onResetTournament,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const metrics = getStorageMetrics();

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      exportTournamentToJson(tournament);
      setFeedbackMessage({
        type: 'success',
        text: '¡Respaldo JSON descargado con éxito! Puedes guardarlo o compartirlo.',
      });
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: 'Error al exportar los datos: ' + err.message,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const validated = validateAndParseTournamentJson(event.target?.result as string);
        onImportTournament(validated);
        setFeedbackMessage({
          type: 'success',
          text: `¡Torneo importado exitosamente con ${validated.teams.length} equipos y ${validated.matches?.length || 0} partidos!`,
        });
      } catch (err: any) {
        setFeedbackMessage({
          type: 'error',
          text: 'Archivo inválido: ' + err.message,
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl animate-in zoom-in-95">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg font-['Chakra_Petch']">
                Gestión de Datos y Respaldo (M2)
              </h3>
              <p className="text-xs text-slate-400">
                Los datos persisten en localStorage. Exporta o importa archivos JSON cuando lo necesites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Métricas de almacenamiento M2 */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Espacio usado: <strong className="text-white">{(metrics.bytes / 1024).toFixed(1)} KB</strong></span>
            </div>
            <span>Guardado: <strong className="text-emerald-400">{metrics.lastSaved ? new Date(metrics.lastSaved).toLocaleTimeString() : 'Al instante'}</strong></span>
          </div>

          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Exportar JSON */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-white block font-['Chakra_Petch'] text-sm">
                Exportar Respaldo a Archivo JSON
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Descarga un archivo con todos los equipos, plantillas, partidos jugados y marcadores actuales.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex-shrink-0 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .JSON</span>
            </button>
          </div>

          {/* Importar JSON */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-white block font-['Chakra_Petch'] text-sm">
                Restaurar Respaldo desde JSON
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Carga un archivo de torneo previamente respaldado en tu computadora o teléfono.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="import-json-file"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex-shrink-0 transition"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Seleccionar Archivo</span>
              </button>
            </div>
          </div>

          {/* Cargar datos de prueba del recreo */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-white block font-['Chakra_Petch'] text-sm">
                Cargar Torneo de Demostración del Recreo
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                4 equipos con capitanes, 4 partidos jugados con empate de puntos y 2 partidos por jugar.
              </p>
            </div>
            <button
              onClick={() => {
                onLoadSampleData();
                setFeedbackMessage({
                  type: 'success',
                  text: '¡Torneo de demostración cargado con éxito!',
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex-shrink-0 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Cargar Demo</span>
            </button>
          </div>

          {/* Reiniciar todo */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-rose-300 block font-['Chakra_Petch'] text-sm">
                Reiniciar y Limpiar Torneo
              </strong>
              <p className="text-xs text-slate-400 mt-0.5">
                Borra todos los equipos y partidos registrados para comenzar un nuevo torneo de recreo.
              </p>
            </div>
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex-shrink-0 transition active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onResetTournament();
                    setShowResetConfirm(false);
                    setFeedbackMessage({
                      type: 'success',
                      text: 'Torneo reiniciado. Puedes empezar a inscribir equipos.',
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition"
                >
                  ¿Confirmar borrado?
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
