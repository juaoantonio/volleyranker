import { ChangeEvent, FormEvent, useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import { User } from "lucide-react";
import { playerAttributes } from "../constants.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase.ts";

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
        block: 5,
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // ✅ Atualiza os valores dos inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlayer((prev) => ({
            ...prev,
            [name]: name === "name" ? value : Number(value),
        }));
    };

    // ✅ Lida com o upload da imagem e armazena temporariamente no estado
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPlayer((prev) => ({
                ...prev,
                imageUrl: previewUrl, // Mostra a prévia da imagem no frontend
            }));
        }
    };

    // ✅ Enviar dados do jogador para o Firebase Firestore
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let imageUrl = "";

        // ✅ Se houver uma imagem, faz o upload para Firebase Storage
        if (imageFile) {
            const imageRef = ref(storage, `players/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        // ✅ Salva os dados no Firestore
        addMutation.mutate({
            ...player,
            imageUrl,
        });

        // ✅ Reseta o formulário após envio
        setPlayer({
            name: "",
            attack: 5,
            serve: 5,
            set: 5,
            defense: 5,
            positioning: 5,
            reception: 5,
            consistency: 5,
            block: 5,
            imageUrl: "",
        });
        setImageFile(null);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 flex items-center gap-2">
                🏐 <User size={28} className="text-blue-500" /> Adicionar Novo
                Jogador
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

                {/* Upload de Imagem */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Foto do Jogador:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded-md"
                    />
                    {player.imageUrl && (
                        <img
                            src={player.imageUrl}
                            alt="Imagem do jogador"
                            className="mt-2 w-24 h-24 rounded-full object-cover"
                        />
                    )}
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
                                    value={player[name as keyof Player]}
                                    onChange={handleChange}
                                    max="5"
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
