import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { generateTeams } from "../services/generateTeams.ts";
import { Player } from "../types/player.ts";

export const TeamGenerator = () => {
  const { players } = usePlayers();
  const [teams, setTeams] = useState<Player[][] | null>(null);
  const [teamSize, setTeamSize] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra os jogadores com base no termo de pesquisa
  const filteredPlayers = (players ?? []).filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Verifica se todos os jogadores filtrados já estão selecionados
  const allFilteredSelected =
    filteredPlayers.length > 0 &&
    filteredPlayers.every((player) =>
      selectedPlayers.some((p) => p.id === player.id),
    );

  // Alterna seleção de um único jogador
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayers(
      (prev) =>
        prev.some((p) => p.id === player.id)
          ? prev.filter((p) => p.id !== player.id) // Remove se já estiver selecionado
          : [...prev, player], // Adiciona se não estiver
    );
  };

  // Alterna seleção de todos os jogadores filtrados
  const handleSelectAll = () => {
    if (allFilteredSelected) {
      // Remove todos os jogadores filtrados da seleção
      setSelectedPlayers((prev) =>
        prev.filter(
          (player) =>
            !filteredPlayers.some(
              (filteredPlayer) => filteredPlayer.id === player.id,
            ),
        ),
      );
    } else {
      // Adiciona os jogadores filtrados que ainda não foram selecionados
      setSelectedPlayers((prev) => {
        const union = [...prev];
        filteredPlayers.forEach((player) => {
          if (!prev.some((p) => p.id === player.id)) {
            union.push(player);
          }
        });
        return union;
      });
    }
  };

  // Gera os times apenas com os jogadores selecionados
  const handleGenerateTeams = () => {
    if (selectedPlayers.length < teamSize) {
      setError("Selecione jogadores suficientes para formar os times.");
      setTeams(null);
      return;
    }

    const result = generateTeams(
      selectedPlayers,
      teamSize,
      selectedPlayers.length,
    );
    if ("error" in result) {
      setError(result.error);
      setTeams(null);
    } else {
      setError(null);
      setTeams(result);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        ⚡ Gerador de Times
      </h2>

      {/* Indicador de seleção */}
      <div className="text-center font-semibold text-gray-700 mb-2">
        Jogadores Selecionados:{" "}
        <span className="text-blue-600">{selectedPlayers.length}</span> /{" "}
        {players?.length}
      </div>

      {/* Barra de pesquisa e botão de selecionar todos */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Pesquisar jogadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={handleSelectAll}
            className="w-5 h-5"
          />
          <span className="text-sm">Selecionar todos</span>
        </label>
      </div>

      {/* Seletor de Jogadores */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          Selecione os jogadores que participarão:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded-lg bg-gray-100 max-h-64 overflow-auto">
          {filteredPlayers.map((player) => (
            <label
              key={player.id}
              className="flex items-center gap-3 bg-white p-2 rounded-md border shadow-sm cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedPlayers.some((p) => p.id === player.id)}
                onChange={() => handleSelectPlayer(player)}
                className="w-5 h-5"
              />
              {player.imageUrl ? (
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">🏐</span>
                </div>
              )}
              <span className="font-semibold">{player.name}</span>
              <span className="text-gray-500 text-sm">
                (Overall: {player.overall})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Inputs para definir o tamanho do time */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Jogadores por Time:
          </label>
          <input
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            min="2"
            className="border p-2 rounded-md w-full"
            placeholder="Ex: 4"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateTeams}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Gerar Times
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Exibição dos times gerados */}
      {teams && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Time {index + 1}
              </h3>
              <ul>
                {team.map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center gap-3 border-b p-2"
                  >
                    {player.imageUrl ? (
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">🏐</span>
                      </div>
                    )}
                    <span className="font-semibold">{player.name}</span>
                    <span className="text-gray-500 text-sm">
                      Overall: {player.overall}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
