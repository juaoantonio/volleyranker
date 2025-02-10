import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { EditPlayer } from "../components/EditPlayer";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const Players = () => {
  const { players, isLoading, removeMutation } = usePlayers();
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  if (isLoading)
    return <p className="text-center text-gray-600">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        🏆 Ranking de Jogadores
      </h2>

      <ul className="space-y-4">
        {players?.map((player) => (
          <li
            key={player.id}
            className="flex flex-col md:flex-row items-center md:justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            {/* Informações do Jogador */}
            <div className="text-lg font-semibold flex flex-col md:flex-row items-center gap-2 w-full md:w-auto text-center md:text-left">
              🏐 {player.name} -
              <span className="text-blue-600">Overall: {player.overall}</span>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-3 md:mt-0 w-full md:w-auto">
              <Link
                to={`/player/${player.id}`}
                className="flex items-center gap-2 px-4 py-2 text-indigo-500 border border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
              >
                <Eye size={18} />{" "}
                <span className="hidden sm:inline">Ver Detalhes</span>
              </Link>

              <button
                onClick={() => setEditingPlayer(player.id!)}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
              >
                <Pencil size={18} />{" "}
                <span className="hidden sm:inline">Editar</span>
              </button>

              <button
                onClick={() => removeMutation.mutate(player.id!)}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
              >
                <Trash2 size={18} />{" "}
                <span className="hidden sm:inline">Remover</span>
              </button>
            </div>

            {/* Edição do Jogador */}
            {editingPlayer === player.id && (
              <div className="w-full mt-4">
                <EditPlayer
                  player={player}
                  onClose={() => setEditingPlayer(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
