import { ChangeEvent, FormEvent, useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Player } from "../types/player";
import { CircleHelp, User } from "lucide-react";
import { playerAttributes } from "../constants";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../services/firebase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { EvaluationHelpModal } from "./EvaluationHelpModal.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

export const AddPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
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

    // Atualiza os valores dos inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlayer((prev) => ({
            ...prev,
            [name]: name === "name" ? value : Number(value),
        }));
    };

    // Lida com o upload da imagem e armazena temporariamente no estado
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

    // Enviar dados do jogador para o Firebase Firestore
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let imageUrl = "";

        // Se houver uma imagem, faz o upload para Firebase Storage
        if (imageFile) {
            const imageRef = ref(storage, `players/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(imageRef);
        }

        // Salva os dados no Firestore
        addMutation.mutate({
            ...player,
            imageUrl,
        });

        // Reseta o formulário após envio
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
        <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
                <User className="text-primary" />
                Adicionar Novo Jogador
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
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
                {/* Upload de Imagem */}
                <div className={"mb-4 flex items-center justify-center"}>
                    {/*{imageFile ? (*/}
                    {/*    <label*/}
                    {/*        htmlFor="image"*/}
                    {/*        className={"block cursor-pointer"}*/}
                    {/*    >*/}
                    {/*        <img*/}
                    {/*            src={player.imageUrl}*/}
                    {/*            alt="Player"*/}
                    {/*            className={"h-20 w-20 rounded-full"}*/}
                    {/*        />*/}
                    {/*    </label>*/}
                    {/*) : (*/}
                    {/*    <label*/}
                    {/*        className={*/}
                    {/*            "flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gray-100"*/}
                    {/*        }*/}
                    {/*        htmlFor={"image"}*/}
                    {/*    >*/}
                    {/*        <User size={36} className={"text-gray-700"} />*/}
                    {/*    </label>*/}
                    {/*)}*/}
                    <label htmlFor="image" className={"block cursor-pointer"}>
                        <Avatar className="h-32 w-32">
                            {player.imageUrl ? (
                                <>
                                    <AvatarImage
                                        src={player.imageUrl}
                                        alt={player.name}
                                        className={"aspect-auto object-cover"}
                                    />
                                    <AvatarFallback>
                                        {player.name[0]}
                                    </AvatarFallback>
                                </>
                            ) : (
                                <AvatarFallback>
                                    <User size={32} className="text-gray-500" />
                                </AvatarFallback>
                            )}
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className={"flex flex-col gap-2"}>
                        <Label>Nome do Jogador:</Label>
                        <div className="flex items-center gap-2">
                            <User size={24} className="text-gray-600" />
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nome do Jogador"
                                value={player.name}
                                onChange={handleChange}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>

                    {playerAttributes.map(({ label, name, icon }) => (
                        <div key={name} className={"flex flex-col gap-2"}>
                            <Label>{label} (0 a 5):</Label>
                            <div className="flex items-center gap-2">
                                {icon}
                                <Input
                                    type="number"
                                    name={name}
                                    value={player[name as keyof Player]}
                                    onChange={handleChange}
                                    max="5"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botão de Submissão */}
                <Button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2"
                >
                    <User size={20} />
                    Adicionar Jogador
                </Button>
            </form>
        </div>
    );
};
