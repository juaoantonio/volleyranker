import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import {
  Hand,
  HandHelping,
  Heart,
  MapPin,
  Repeat,
  Shield,
  Target,
  User,
  Volleyball,
} from "lucide-react";

export const AddPlayer = () => {
  const { addMutation } = usePlayers();
  const [player, setPlayer] = useState<Player>({
    name: "",
    attack: 5,
    serve: 5,
    set: 5,
    defense: 5,
    positioning: 5,
    reception: 5,
    consistency: 5,
    stamina: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayer((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value), // Converte valores numéricos
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const overall = (
      player.attack * 0.2 +
      player.serve * 0.15 +
      player.set * 0.15 +
      player.defense * 0.15 +
      player.positioning * 0.1 +
      player.reception * 0.1 +
      player.consistency * 0.1 +
      player.stamina * 0.05
    ).toFixed(2);

    addMutation.mutate({ ...player, overall: Number(overall) });

    // Resetar formulário após envio
    setPlayer({
      name: "",
      attack: 5,
      serve: 5,
      set: 5,
      defense: 5,
      positioning: 5,
      reception: 5,
      consistency: 5,
      stamina: 5,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 flex items-center gap-2">
        🏐 <User size={28} className="text-blue-500" /> Adicionar Novo Jogador
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
              placeholder="Nome do Jogador"
              value={player.name}
              onChange={handleChange}
              required
              className="w-full p-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid de Atributos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Ataque",
              name: "attack",
              icon: <Target size={20} className="text-red-500" />,
            },
            {
              label: "Força de Saque",
              name: "serve",
              icon: <Volleyball size={20} className="text-orange-500" />,
            },
            {
              label: "Levantamento",
              name: "set",
              icon: <Hand size={20} className="text-yellow-500" />,
            },
            {
              label: "Defesa",
              name: "defense",
              icon: <Shield size={20} className="text-green-500" />,
            },
            {
              label: "Posicionamento",
              name: "positioning",
              icon: <MapPin size={20} className="text-blue-500" />,
            },
            {
              label: "Recepção",
              name: "reception",
              icon: <HandHelping size={20} className="text-indigo-500" />,
            },
            {
              label: "Constância",
              name: "consistency",
              icon: <Repeat size={20} className="text-purple-500" />,
            },
            {
              label: "Resistência Física",
              name: "stamina",
              icon: <Heart size={20} className="text-pink-500" />,
            },
          ].map(({ label, name, icon }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}:
              </label>
              <div className="flex items-center border p-2 rounded-md gap-2">
                {icon}
                <input
                  type="number"
                  name={name}
                  value={player[name as keyof Player]}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Submissão */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
        >
          <User size={20} /> Adicionar Jogador
        </button>
      </form>
    </div>
  );
};
