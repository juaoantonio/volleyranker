import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import { ArrowLeft, Check, User } from "lucide-react";
import { playerAttributes } from "../constants.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase.ts";

export const EditPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const { players, updateMutation } = usePlayers();
  const navigate = useNavigate();

  // Busca o jogador pelo ID
  const player = players?.find((p) => p.id === id);

  const [updatedPlayer, setUpdatedPlayer] = useState<Partial<Player>>(
    player || {},
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    player?.imageUrl || "",
  );

  if (!player) {
    return <p className="text-center text-red-500">Jogador não encontrado.</p>;
  }

  // ✅ Atualiza os valores dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedPlayer((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  };

  // ✅ Atualiza a imagem ao selecionar um novo arquivo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Atualiza a prévia da imagem
    }
  };

  // ✅ Enviar atualização para Firebase
  const handleSubmit = async (e: FormEvent) => {
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

    let imageUrl = player.imageUrl || "";

    // ✅ Se houver uma nova imagem, faz o upload para Firebase Storage
    if (imageFile) {
      const imageRef = ref(storage, `players/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // ✅ Atualiza os dados do jogador no Firestore
    updateMutation.mutate({
      id: player.id!,
      updatedPlayer: { ...updatedPlayer, overall: Number(overall), imageUrl },
    });

    navigate("/"); // Redireciona para a listagem após atualização
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <Link to="/admin" className="text-blue-500 flex items-center gap-2 mb-4">
        <ArrowLeft size={18} /> Voltar para o Ranking
      </Link>

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

        {/* Upload de Imagem */}
        <div className="text-center">
          <label className="block text-gray-700 font-medium mb-1">
            Foto do Jogador:
          </label>
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Foto do jogador"
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <User size={32} className="text-gray-500" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border rounded-md"
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
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 flex gap-2 bg-green-500  items-center text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            <Check size={18} /> Atualizar Jogador
          </button>
        </div>
      </form>
    </div>
  );
};
