import { usePlayers } from "../hooks/usePlayers";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

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

  // Ordenando os jogadores pelo overall (Maior para Menor)
  const sortedPlayers = [...players].sort((a, b) => b.overall - a.overall);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        🏆 Ranking de Jogadores
      </h2>

      <ul className="space-y-4">
        {sortedPlayers.map((player) => (
          <li
            key={player.id}
            className="flex flex-col md:flex-row items-center md:justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            {/* Informações do Jogador */}
            <div className="text-lg font-semibold flex flex-col md:flex-row items-center gap-2">
              🏐 {player.name} -
              <span className="text-blue-600">Overall: {player.overall}</span>
            </div>

            {/* Botão apenas para visualizar detalhes */}
            <div className="flex justify-center md:justify-end gap-3 mt-3 md:mt-0">
              <Link
                to={`/admin/player/${player.id}`}
                className="flex items-center gap-2 px-4 py-2 text-indigo-500 border border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
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
