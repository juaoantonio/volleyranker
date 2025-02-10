import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { EditPlayer } from "../components/EditPlayer.tsx";
import { Pencil, Trash2, Trophy } from "lucide-react";

export const Players = () => {
  const { players, isLoading, removeMutation } = usePlayers();
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  if (isLoading)
    return <p className="text-center text-gray-500 text-lg">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 flex items-center justify-center gap-2">
        <Trophy size={28} className="text-yellow-500" /> Ranking de Jogadores
      </h2>

      <ul className="space-y-4">
        {players?.map((player) => (
          <li
            key={player.id}
            className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            <div className="text-lg font-semibold flex items-center gap-2">
              🏐 {player.name} -
              <span className="text-blue-600">Overall: {player.overall}</span>
            </div>

            <div className="flex gap-3 mt-2 md:mt-0">
              <button
                onClick={() => setEditingPlayer(player.id!)}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
              >
                <Pencil size={18} /> Editar
              </button>

              <button
                onClick={() => removeMutation.mutate(player.id!)}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
              >
                <Trash2 size={18} /> Remover
              </button>
            </div>

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
