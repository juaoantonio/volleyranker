import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import { Check, CircleHelp, User } from "lucide-react";
import { playerAttributes } from "../constants.tsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase.ts";
import { Button } from "./ui/button.tsx";
import { EvaluationHelpModal } from "./EvaluationHelpModal.tsx";
import { Label } from "./ui/label.tsx";
import { Input } from "./ui/input.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

export const EditPlayer = () => {
    const { id } = useParams<{ id: string }>();
    const { players, updateMutation } = usePlayers();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

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
        return (
            <p className="text-center text-red-500">Jogador não encontrado.</p>
        );
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
            updatedPlayer: { ...updatedPlayer, imageUrl },
        });

        navigate(-1);
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
                <User className="text-primary" />
                Editar Jogador
            </div>

            <Button
                onClick={() => setIsOpen(true)}
                variant={"ghost"}
                className={
                    "text-primary/80 my-3 flex w-full items-center gap-2"
                }
            >
                <CircleHelp size={20} /> Como Avaliar Jogadores?
            </Button>
            <EvaluationHelpModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome do Jogador */}
                <div>
                    <label className="mb-1 block font-medium text-gray-700">
                        Nome do Jogador:
                    </label>
                    <div className="flex items-center gap-2 rounded-md border p-2">
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
                <div className={"mb-4 flex items-center justify-center"}>
                    <label htmlFor="image" className={"block cursor-pointer"}>
                        <Avatar className="h-32 w-32">
                            <AvatarImage
                                src={imagePreview || player.imageUrl}
                                alt={player.name}
                                className={"aspect-auto object-cover"}
                            />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                    </label>

                    <input
                        id={"image"}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="pointer-events-none hidden"
                    />
                </div>

                {/* Grid de Atributos */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {playerAttributes.map(({ label, name, icon }) => (
                        <div key={name}>
                            <Label>{label} (0 a 5):</Label>
                            <div className="flex items-center gap-2 rounded-md border p-2">
                                {icon}
                                <Input
                                    type="number"
                                    name={name}
                                    value={
                                        updatedPlayer[name as keyof Player] ??
                                        player[name as keyof Player]
                                    }
                                    onChange={handleChange}
                                    max="5"
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
                        className="rounded-md bg-gray-400 px-4 py-2 text-white transition duration-300 hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
                    >
                        <Check size={18} /> Atualizar Jogador
                    </button>
                </div>
            </form>
        </div>
    );
};
