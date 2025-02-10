import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { generateTeams } from "../services/generateTeams.ts";
import { Player } from "../types/player.ts";

export const TeamGenerator = () => {
  const { players } = usePlayers();
  const [teams, setTeams] = useState<Player[][] | null>(null);
  const [teamSize, setTeamSize] = useState(4);
  const [totalPlayers, setTotalPlayers] = useState(16);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTeams = () => {
    const result = generateTeams(players ?? [], teamSize, totalPlayers);
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

      {/* Inputs para definir o número total de jogadores e tamanho do time */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Total de Jogadores no Grupo:
          </label>
          <input
            type="number"
            value={totalPlayers}
            onChange={(e) => setTotalPlayers(Number(e.target.value))}
            min="4"
            max={players?.length}
            className="border p-2 rounded-md w-full"
            placeholder="Ex: 16"
          />
        </div>

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
