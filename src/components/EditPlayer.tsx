import { FormEvent, useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";

interface Props {
  player: Player;
  onClose: () => void;
}

export const EditPlayer = ({ player, onClose }: Props) => {
  const { updateMutation } = usePlayers();
  const [updatedPlayer, setUpdatedPlayer] = useState<Partial<Player>>(player);

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: player.id!, updatedPlayer });
    onClose();
  };

  return (
    <form onSubmit={handleUpdate} className="p-4 border rounded">
      <input
        type="text"
        value={updatedPlayer.name}
        onChange={(e) =>
          setUpdatedPlayer({ ...updatedPlayer, name: e.target.value })
        }
        className="border p-2"
      />
      <button type="submit" className="ml-2 p-2 bg-green-500 text-white">
        Atualizar
      </button>
    </form>
  );
};
