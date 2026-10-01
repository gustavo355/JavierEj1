import React, { useState } from 'react';
import { Plus, Trash2, Edit3, UserCheck, Shield, Users, AlertCircle, X, Check } from 'lucide-react';
import { Team, Player } from '../types/tournament';

interface TeamsManagerProps {
  teams: Team[];
  onAddTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  onUpdateTeam: (id: string, team: Partial<Team>) => void;
  onDeleteTeam: (id: string) => void;
  onAddPlayer: (teamId: string, player: Omit<Player, 'id'>) => void;
  onRemovePlayer: (teamId: string, playerId: string) => void;
  hasMatches: boolean;
}

const COLOR_PALETTE = [
  '#06b6d4', // Cyan
  '#ef4444', // Rojo
  '#f59e0b', // Ámbar
  '#10b981', // Esmeralda
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#3b82f6', // Azul
  '#f97316', // Naranja
];

const EMOJI_LIST = ['⚡', '🔥', '🦅', '⚽', '🦁', '🐺', '🛡️', '🌪️', '🚀', '⭐'];

export const TeamsManager: React.FC<TeamsManagerProps> = ({
  teams,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onAddPlayer,
  onRemovePlayer,
  hasMatches,
}) => {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [selectedTeamForRoster, setSelectedTeamForRoster] = useState<Team | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [captain, setCaptain] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [emoji, setEmoji] = useState(EMOJI_LIST[0]);
  const [formError, setFormError] = useState<string | null>(null);

  // Player form states
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState<string>('');
  const [playerPosition, setPlayerPosition] = useState<Player['position']>('Jugador');
  const [playerError, setPlayerError] = useState<string | null>(null);

  const resetTeamForm = () => {
    setName('');
    setCaptain('');
    setColor(COLOR_PALETTE[teams.length % COLOR_PALETTE.length] || COLOR_PALETTE[0]);
    setEmoji(EMOJI_LIST[teams.length % EMOJI_LIST.length] || EMOJI_LIST[0]);
    setFormError(null);
    setIsAddingTeam(false);
    setEditingTeamId(null);
  };

  const handleStartEdit = (team: Team) => {
    setName(team.name);
    setCaptain(team.captain);
    setColor(team.color);
    setEmoji(team.emoji);
    setEditingTeamId(team.id);
    setIsAddingTeam(true);
    setFormError(null);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.replace(/[<>]/g, '').trim();
    const cleanCaptain = captain.replace(/[<>]/g, '').trim();

    // M4 Validaciones estrictas
    if (!cleanName) {
      setFormError('El nombre del equipo no puede estar vacío.');
      return;
    }
    if (cleanName.length < 2) {
      setFormError('El nombre del equipo debe tener al menos 2 caracteres.');
      return;
    }
    if (cleanName.length > 30) {
      setFormError('El nombre no puede exceder los 30 caracteres.');
      return;
    }

    // Comprobar duplicados
    const duplicate = teams.find(
      (t) => t.id !== editingTeamId && t.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      setFormError(`Ya existe un equipo registrado con el nombre "${cleanName}".`);
      return;
    }

    if (editingTeamId) {
      onUpdateTeam(editingTeamId, {
        name: cleanName,
        captain: cleanCaptain || 'Por asignar',
        color,
        emoji,
      });
    } else {
      onAddTeam({
        name: cleanName,
        captain: cleanCaptain || 'Por asignar',
        color,
        emoji,
        players: cleanCaptain
          ? [{ id: `p_${Date.now()}`, name: cleanCaptain, number: 10, position: 'Delantero' }]
          : [],
        yellowCards: 0,
        redCards: 0,
      });
    }

    resetTeamForm();
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForRoster) return;

    const cleanPlayerName = playerName.replace(/[<>]/g, '').trim().slice(0, 30);
    if (!cleanPlayerName) {
      setPlayerError('Escribe el nombre del jugador.');
      return;
    }
    if (cleanPlayerName.length < 2) {
      setPlayerError('El nombre debe tener al menos 2 letras.');
      return;
    }

    const num = playerNumber ? parseInt(playerNumber.replace(/\D/g, ''), 10) : undefined;
    if (num !== undefined && (isNaN(num) || num < 1 || num > 99)) {
      setPlayerError('El número dorsal debe ser un entero entre 1 y 99.');
      return;
    }

    onAddPlayer(selectedTeamForRoster.id, {
      name: cleanPlayerName,
      number: num,
      position: playerPosition,
    });

    setPlayerName('');
    setPlayerNumber('');
    setPlayerPosition('Jugador');
    setPlayerError(null);

    // Actualizar referencia local del modal
    const updatedTeam = teams.find((t) => t.id === selectedTeamForRoster.id);
    if (updatedTeam) {
      setSelectedTeamForRoster({
        ...updatedTeam,
        players: [
          ...updatedTeam.players,
          { id: `temp_${Date.now()}`, name: cleanPlayerName, number: num, position: playerPosition },
        ],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra superior de sección con botón de acción primario */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Chakra_Petch']">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Equipos Registrados ({teams.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Función 1: Inscribe a las escuadras del salón o recreo y gestiona sus plantillas.
          </p>
        </div>

        {!isAddingTeam && (
          <button
            onClick={() => {
              setIsAddingTeam(true);
              setEditingTeamId(null);
              setName('');
              setCaptain('');
              setColor(COLOR_PALETTE[teams.length % COLOR_PALETTE.length] || COLOR_PALETTE[0]);
              setEmoji(EMOJI_LIST[teams.length % EMOJI_LIST.length] || EMOJI_LIST[0]);
              setFormError(null);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Inscribir Nuevo Equipo</span>
          </button>
        )}
      </div>

      {hasMatches && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2.5 text-xs sm:text-sm text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Atención:</strong> Ya existe un calendario de partidos activo. Si modificas o eliminas un equipo, el calendario y los resultados se conservarán con el ID correspondiente.
          </span>
        </div>
      )}

      {/* Formulario de registro / edición */}
      {isAddingTeam && (
        <form
          onSubmit={handleSaveTeam}
          className="bg-slate-900 border border-cyan-500/30 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in-50"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base font-['Chakra_Petch'] flex items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <span>{editingTeamId ? 'Editar Equipo' : 'Nuevo Equipo del Recreo'}</span>
            </h3>
            <button
              type="button"
              onClick={resetTeamForm}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-lg text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="team-name" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                Nombre del Equipo *
              </label>
              <input
                id="team-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError(null);
                }}
                placeholder="Ej. Furia Roja 3°B"
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="team-captain" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 font-semibold">
                Capitán / Encargado
              </label>
              <input
                id="team-captain"
                type="text"
                value={captain}
                onChange={(e) => setCaptain(e.target.value)}
                placeholder="Ej. Kevin Morales"
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
          </div>

          {/* Color y Emoji */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
                Color de Uniforme
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition transform active:scale-90 ${
                      color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
                Insignia / Emoji
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {EMOJI_LIST.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition ${
                      emoji === em
                        ? 'bg-cyan-500/20 border-cyan-400 scale-110'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de guardar */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={resetTeamForm}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition"
            >
              {editingTeamId ? 'Guardar Cambios' : 'Registrar Equipo'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de equipos */}
      {teams.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-3xl mx-auto text-slate-400">
            ⚽
          </div>
          <h3 className="text-lg font-bold text-white font-['Chakra_Petch']">
            No hay equipos inscritos en el torneo
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            El recreo se acerca. Agrega al menos 2 equipos para generar el fixture equilibrado de partidos y calcular la tabla automáticamente.
          </p>
          <button
            onClick={() => setIsAddingTeam(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primer Equipo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0"
                      style={{ backgroundColor: `${team.color}25`, border: `2px solid ${team.color}` }}
                    >
                      {team.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-lg font-['Chakra_Petch']">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        Capitán: <span className="text-slate-200">{team.captain || 'Sin capitán'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(team)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                      title="Editar datos del equipo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al equipo "${team.name}" del torneo?`)) {
                          onDeleteTeam(team.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Eliminar equipo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Resumen de plantilla */}
                <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Jugadores registrados: <strong className="text-white">{team.players.length}</strong>
                  </span>

                  <button
                    onClick={() => setSelectedTeamForRoster(team)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs transition"
                  >
                    <span>Ver / Agregar Plantilla</span>
                  </button>
                </div>
              </div>

              {/* Muestra de primeros 3 jugadores si existen */}
              {team.players.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {team.players.slice(0, 4).map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {p.number !== undefined && <b className="text-cyan-400">#{p.number}</b>}
                      <span>{p.name}</span>
                    </span>
                  ))}
                  {team.players.length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono self-center">
                      +{team.players.length - 4} más
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de gestión de plantilla de jugadores */}
      {selectedTeamForRoster && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedTeamForRoster.emoji}</span>
                <div>
                  <h3 className="font-bold text-white text-lg font-['Chakra_Petch']">
                    Plantilla: {selectedTeamForRoster.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Capitán: {selectedTeamForRoster.captain} · Total: {selectedTeamForRoster.players.length} jugadores
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeamForRoster(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario rápido para añadir jugador */}
            <form onSubmit={handleSavePlayer} className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                + Inscribir Jugador
              </div>

              {playerError && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{playerError}</span>
                </div>
              )}

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6 sm:col-span-5">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nombre del jugador"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="col-span-3 sm:col-span-3">
                  <input
                    type="number"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    placeholder="Dorsal"
                    min={0}
                    max={99}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="col-span-3 sm:col-span-4 flex items-center gap-1.5">
                  <select
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value as Player['position'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Portero">Portero</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Medio">Medio</option>
                    <option value="Delantero">Delantero</option>
                    <option value="Jugador">Jugador</option>
                  </select>

                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex-shrink-0"
                    title="Añadir a la lista"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Lista con scroll */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {selectedTeamForRoster.players.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500">
                  No hay jugadores agregados aún en este equipo.
                </p>
              ) : (
                selectedTeamForRoster.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[11px]">
                        {player.number !== undefined ? player.number : '-'}
                      </span>
                      <span className="text-white font-medium">{player.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                        {player.position || 'Jugador'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onRemovePlayer(selectedTeamForRoster.id, player.id);
                        setSelectedTeamForRoster({
                          ...selectedTeamForRoster,
                          players: selectedTeamForRoster.players.filter((p) => p.id !== player.id),
                        });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Eliminar jugador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTeamForRoster(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cerrar Plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
