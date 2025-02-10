import { FormEvent, useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import { User } from "lucide-react";
import { playerAttributes } from "../constants.tsx";

interface Props {
  player: Player;
  onClose: () => void;
}

export const EditPlayer = ({ player, onClose }: Props) => {
  const { updateMutation } = usePlayers();
  const [updatedPlayer, setUpdatedPlayer] = useState<Partial<Player>>(player);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedPlayer((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value), // Converte valores numéricos
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Recalcular o Overall ao atualizar o jogador
    const overall = (
      (updatedPlayer.attack ?? player.attack) * 0.2 +
      (updatedPlayer.serve ?? player.serve) * 0.15 +
      (updatedPlayer.set ?? player.set) * 0.15 +
      (updatedPlayer.defense ?? player.defense) * 0.15 +
      (updatedPlayer.positioning ?? player.positioning) * 0.1 +
      (updatedPlayer.reception ?? player.reception) * 0.1 +
      (updatedPlayer.consistency ?? player.consistency) * 0.1 +
      (updatedPlayer.stamina ?? player.stamina) * 0.05
    ).toFixed(2);

    updateMutation.mutate({
      id: player.id!,
      updatedPlayer: { ...updatedPlayer, overall: Number(overall) },
    });

    onClose();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 flex items-center gap-2">
        ✏️ <User size={28} className="text-green-500" /> Editar Jogador
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome do Jogador */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nome do Jogador:
          </label>
          <div className="flex items-center border p-2 rounded-md gap-2">
            <User size={24} className="text-gray-600" />
            <input
              type="text"
              name="name"
              value={updatedPlayer.name ?? player.name}
              onChange={handleChange}
              required
              className="w-full p-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid de Atributos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {playerAttributes.map(({ label, name, icon }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">
                {label} (0 a 5):
              </label>
              <div className="flex items-center border p-2 rounded-md gap-2">
                {icon}
                <input
                  type="number"
                  name={name}
                  value={
                    updatedPlayer[name as keyof Player] ??
                    player[name as keyof Player]
                  }
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            ✅ Atualizar Jogador
          </button>
        </div>
      </form>
    </div>
  );
};
