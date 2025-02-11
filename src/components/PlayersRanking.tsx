import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Link } from "react-router-dom";
import { Crown, Eye, Search, User } from "lucide-react";
import { calculateOverall, cn } from "../utils.ts";

export function PlayersRanking() {
  const { players, isLoading } = usePlayers();
  const [query, setQuery] = useState("");

  if (isLoading)
    return <p className="text-center text-gray-600">Carregando...</p>;

  if (!players?.length) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
        <p className="text-gray-600">Nenhum jogador cadastrado.</p>
      </div>
    );
  }

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredPlayers = players
    .sort((a, b) => calculateOverall(b) - calculateOverall(a))
    .filter((player) =>
      normalizeText(player.name).includes(normalizeText(query)),
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        🏆 Ranking de Jogadores
      </h2>

      <div className="relative mb-6">
        <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar jogador..."
            className="w-full focus:outline-none text-gray-800"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum jogador encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {filteredPlayers.map((player, index) => (
            <li
              key={player.id}
              className="flex flex-col md:flex-row items-center md:justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <span
                className={cn(
                  "flex items-center gap-2 font-bold md:mr-4 text-xl md:text-2xl",
                  {
                    "text-yellow-500": index === 0,
                    "text-gray-500": index === 1,
                    "text-orange-500": index === 2,
                    "text-gray-600": index > 2,
                  },
                )}
              >
                {index < 3 ? <Crown size={24} /> : <User size={24} />} #
                {index + 1}
              </span>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                )}

                <div className="text-sm md:text-lg font-semibold">
                  <div>🏐 {player.name}</div>
                  <div className="text-blue-600">
                    Overall: {calculateOverall(player)}
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-end gap-3 mt-3 md:mt-0 w-full md:w-auto">
                <Link
                  to={`/admin/player/${player.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-indigo-500 border border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300 text-sm md:text-base"
                >
                  <Eye size={18} /> Ver Detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
