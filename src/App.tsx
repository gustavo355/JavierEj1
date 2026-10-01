/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Calendar, Users, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Tournament, Team, Match, MatchStatus, Player, AiAnalysisResult } from './types/tournament';
import { SAMPLE_TOURNAMENT } from './utils/sampleData';
import { calculateStandings } from './utils/standingsCalculator';
import { generateRoundRobinFixture } from './utils/fixtureGenerator';
import { Header } from './components/Header';
import { TeamsManager } from './components/TeamsManager';
import { FixtureViewer } from './components/FixtureViewer';
import { StandingsTable } from './components/StandingsTable';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { PracticeDossierModal } from './components/PracticeDossierModal';
import { ExportImportModal } from './components/ExportImportModal';
import { loadTournamentFromStorage, saveTournamentToStorage, sanitizeTournamentData } from './utils/storageHelper';

export default function App() {
  // Cargar estado inicial desde localStorage (M2: Que recuerde) o el demo representativo (con saneamiento M4)
  const [tournament, setTournament] = useState<Tournament>(() => {
    const loaded = loadTournamentFromStorage();
    if (loaded) return sanitizeTournamentData(loaded);
    return sanitizeTournamentData(SAMPLE_TOURNAMENT);
  });

  // Pestaña activa
  const [activeTab, setActiveTab] = useState<'tabla' | 'fixture' | 'equipos'>('tabla');

  // Modales
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Estados de IA (M5)
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Guardar en localStorage y crear snapshot de seguridad con cada cambio (M2)
  useEffect(() => {
    saveTournamentToStorage(tournament);
  }, [tournament]);

  // Recalcular tabla de posiciones en tiempo real (M1 y M2)
  const standings = useMemo(() => {
    return calculateStandings(tournament.teams, tournament.matches);
  }, [tournament.teams, tournament.matches]);

  // Manejo de equipos
  const handleAddTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    setTournament((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
      updatedAt: new Date().toISOString(),
    }));

    showToast(`Equipo "${newTeam.name}" registrado con éxito.`);
  };

  const handleUpdateTeam = (id: string, updates: Partial<Team>) => {
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      // Actualizar también nombres en partidos si cambiaron
      matches: prev.matches.map((m) => {
        let hName = m.homeTeamName;
        let aName = m.awayTeamName;
        if (m.homeTeamId === id && updates.name) hName = updates.name;
        if (m.awayTeamId === id && updates.name) aName = updates.name;
        return { ...m, homeTeamName: hName, awayTeamName: aName };
      }),
      updatedAt: new Date().toISOString(),
    }));

    showToast('Datos del equipo actualizados.');
  };

  const handleDeleteTeam = (id: string) => {
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== id),
      matches: prev.matches.filter((m) => m.homeTeamId !== id && m.awayTeamId !== id),
      updatedAt: new Date().toISOString(),
    }));

    showToast('Equipo eliminado del torneo.');
  };

  const handleAddPlayer = (teamId: string, player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: `player_${Date.now()}`,
    };

    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, players: [...t.players, newPlayer] } : t
      ),
      updatedAt: new Date().toISOString(),
    }));

    showToast(`Jugador ${newPlayer.name} agregado a la plantilla.`);
  };

  const handleRemovePlayer = (teamId: string, playerId: string) => {
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, players: t.players.filter((p) => p.id !== playerId) } : t
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Manejo de Fixture Round-Robin
  const handleGenerateFixture = () => {
    if (tournament.teams.length < 2) {
      showToast('Se necesitan al menos 2 equipos para armar el fixture.', 'error');
      return;
    }

    const { matches } = generateRoundRobinFixture(tournament.teams);
    setTournament((prev) => ({
      ...prev,
      matches,
      updatedAt: new Date().toISOString(),
    }));

    showToast(`¡Fixture de ${matches.length} partidos generado con éxito!`);
    setActiveTab('fixture');
  };

  // Actualización de marcador con límites defensivos (M4)
  const handleUpdateMatchScore = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: MatchStatus,
    homeCards?: number,
    awayCards?: number,
    notes?: string
  ) => {
    // M4: Defensa contra desbordamiento de enteros y caracteres ilegales
    const boundedHome = Math.min(50, Math.max(0, Math.floor(Number(homeScore) || 0)));
    const boundedAway = Math.min(50, Math.max(0, Math.floor(Number(awayScore) || 0)));
    const boundedHomeCards = Math.min(10, Math.max(0, Math.floor(Number(homeCards) || 0)));
    const boundedAwayCards = Math.min(10, Math.max(0, Math.floor(Number(awayCards) || 0)));
    const boundedNotes = notes ? notes.replace(/[<>]/g, '').trim().slice(0, 80) : undefined;

    setTournament((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              homeScore: boundedHome,
              awayScore: boundedAway,
              status,
              homeYellowCards: boundedHomeCards,
              awayYellowCards: boundedAwayCards,
              notes: boundedNotes,
              playedAt: status === 'finished' ? new Date().toISOString() : m.playedAt,
            }
          : m
      ),
      updatedAt: new Date().toISOString(),
    }));

    showToast(
      status === 'finished'
        ? '¡Marcador registrado! Tabla de posiciones recalculada en tiempo real.'
        : 'Partido actualizado.'
    );
  };

  // M5: Llamada a endpoint de IA para análisis de desempates con salida estructurada
  const handleFetchAiAnalysis = async () => {
    if (tournament.teams.length < 2) {
      showToast('Registra al menos 2 equipos para solicitar el análisis de IA.', 'error');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setIsAiModalOpen(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch('/api/gemini/analyze-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          tournamentName: tournament.name,
          teams: tournament.teams,
          matches: tournament.matches,
          standings,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: HTTP ${response.status}`);
      }

      const data = await response.json();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error('Error fetching AI analysis:', err);
      if (err.name === 'AbortError') {
        setAiError('Tiempo de espera agotado: la conexión en el patio es inestable.');
      } else {
        setAiError(err.message || 'No se pudo conectar con el servicio de análisis.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] pb-20 sm:pb-8 selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-rose-500/50 text-rose-300'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Cabecera Deportiva */}
      <Header
        tournament={tournament}
        onOpenAiAnalysis={handleFetchAiAnalysis}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onQuickDemoLoad={() => {
          setTournament(SAMPLE_TOURNAMENT);
          showToast('Torneo de prueba cargado con 4 equipos y resultados.');
        }}
        isAiLoading={isAiLoading}
      />

      {/* Barra de pestañas en escritorio y tablets */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 sm:pt-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tabla')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-['Chakra_Petch'] text-sm font-bold transition ${
                activeTab === 'tabla'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Tabla de Posiciones</span>
            </button>

            <button
              onClick={() => setActiveTab('fixture')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-['Chakra_Petch'] text-sm font-bold transition ${
                activeTab === 'fixture'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Partidos / Fixture ({tournament.matches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('equipos')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-['Chakra_Petch'] text-sm font-bold transition ${
                activeTab === 'equipos'
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Equipos ({tournament.teams.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsDossierOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            <span>Ver bitácora de 6 prompts & defensa</span>
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <main className="max-w-7xl mx-auto w-full px-4 py-4 sm:py-6 flex-1">
        {activeTab === 'tabla' && (
          <StandingsTable
            standings={standings}
            onOpenAiAnalysis={handleFetchAiAnalysis}
          />
        )}

        {activeTab === 'fixture' && (
          <FixtureViewer
            matches={tournament.matches}
            teams={tournament.teams}
            onGenerateFixture={handleGenerateFixture}
            onUpdateMatchScore={handleUpdateMatchScore}
            onResetMatches={() => {
              setTournament((prev) => ({ ...prev, matches: [] }));
              showToast('Fixture reiniciado.');
            }}
          />
        )}

        {activeTab === 'equipos' && (
          <TeamsManager
            teams={tournament.teams}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            hasMatches={tournament.matches.length > 0}
          />
        )}
      </main>

      {/* Barra de navegación inferior móvil ergonómica con una sola mano (M3) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('tabla')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-mono transition ${
            activeTab === 'tabla' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Tabla</span>
        </button>

        <button
          onClick={() => setActiveTab('fixture')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-mono transition ${
            activeTab === 'fixture' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Fixture</span>
        </button>

        <button
          onClick={() => setActiveTab('equipos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-mono transition ${
            activeTab === 'equipos' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Equipos</span>
        </button>

        <button
          onClick={handleFetchAiAnalysis}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-mono text-pink-400 font-bold"
        >
          <Sparkles className="w-5 h-5" />
          <span>IA</span>
        </button>
      </nav>

      {/* Modales */}
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        analysis={aiAnalysis}
        isLoading={isAiLoading}
        errorMessage={aiError}
        onReanalyze={handleFetchAiAnalysis}
      />

      <PracticeDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      <ExportImportModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        tournament={tournament}
        onImportTournament={(imported) => {
          setTournament(imported);
          showToast('Torneo cargado desde respaldo JSON.');
        }}
        onLoadSampleData={() => {
          setTournament(SAMPLE_TOURNAMENT);
          showToast('Torneo de ejemplo cargado.');
        }}
        onResetTournament={() => {
          setTournament({
            id: `torneo_${Date.now()}`,
            name: 'Torneo Relámpago del Recreo',
            organizer: 'Organizador Estudiantil',
            section: '3.er año · Desarrollo de Software «B»',
            matchDurationMinutes: 15,
            teams: [],
            matches: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          showToast('Torneo reiniciado.');
        }}
      />
    </div>
  );
}
