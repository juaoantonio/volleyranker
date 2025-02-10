import { usePlayers } from "../hooks/usePlayers";
import { Link } from "react-router-dom";
import { Crown, Eye, User } from "lucide-react";
import { cn } from "../utils.ts";

export const PlayersView = () => {
  const { players, isLoading } = usePlayers();

  if (isLoading)
    return <p className="text-center text-gray-600">Carregando...</p>;

  if (!players?.length) {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
        <p className="text-gray-600">Nenhum jogador cadastrado.</p>
      </div>
    );
  }

  // Ordena os jogadores pelo overall (do maior para o menor)
  const sortedPlayers = [...players].sort((a, b) => b.overall - a.overall);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        🏆 Ranking de Jogadores
      </h2>

      <ul className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.id}
            className="flex flex-col md:flex-row items-center md:justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            {/* Ranking com ícone */}
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

            {/* Container da imagem e informações */}
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
                <div className="text-blue-600">Overall: {player.overall}</div>
              </div>
            </div>

            {/* Botão para ver detalhes */}
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
    </div>
  );
};
