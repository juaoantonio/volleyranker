import { Link, useParams } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";
import { ArrowLeft } from "lucide-react";
import { calculateOverall } from "../utils.ts";

export const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { players } = usePlayers();

  const player = players?.find((p) => p.id === id);

  if (!player) {
    return <p className="text-center text-red-500">Jogador não encontrado.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <Link to="/admin" className="text-blue-500 flex items-center gap-2 mb-4">
        <ArrowLeft size={18} /> Voltar para o Ranking
      </Link>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {player.name} - Overall:{" "}
        <span className="text-blue-600">{calculateOverall(player)}</span>
      </h2>

      {/* Atributos do jogador */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
        <p>
          <strong>Ataque:</strong> {player.attack}
        </p>
        <p>
          <strong>Eficiência no Saque:</strong> {player.serve}
        </p>
        <p>
          <strong>Levantamento:</strong> {player.set}
        </p>
        <p>
          <strong>Defesa:</strong> {player.defense}
        </p>
        <p>
          <strong>Posicionamento:</strong> {player.positioning}
        </p>
        <p>
          <strong>Recepção:</strong> {player.reception}
        </p>
        <p>
          <strong>Constância:</strong> {player.consistency}
        </p>
        <p>
          <strong>Bloqueio</strong> {player.block}
        </p>
      </div>
    </div>
  );
};
