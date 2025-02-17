import { usePlayers } from "../hooks/usePlayers";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import {
    assignPosition,
    calculateOverall,
    cn,
    positionColors,
} from "../utils.ts";
import { Loading } from "../components/loading.tsx";

export const Players = () => {
    const { players, isLoading, removeMutation } = usePlayers();

    if (isLoading) return <Loading />;

    if (!players?.length) {
        return (
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 text-center">
                <p className="text-gray-600">Nenhum jogador cadastrado.</p>
            </div>
        );
    }

    players.sort((a, b) => calculateOverall(b) - calculateOverall(a));

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Listagem de Jogadores
            </h2>

            <ul className="space-y-4">
                {players?.map((player) => (
                    <li
                        key={player.id}
                        className="flex flex-col md:flex-row items-center md:justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                        <div
                            className={
                                "flex justify-between w-full items-center"
                            }
                        >
                            <div className="flex items-center gap-4">
                                {player.imageUrl ? (
                                    <img
                                        src={player.imageUrl}
                                        alt={player.name}
                                        className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User
                                            size={32}
                                            className="text-gray-500"
                                        />
                                    </div>
                                )}

                                <div className="text-lg font-semibold">
                                    <span>🏐 {player.name}</span>
                                    <span className="block text-blue-600">
                                        Overall: {calculateOverall(player)}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={cn(
                                    "text-center mx-auto py-1 px-3 rounded-full block w-min",
                                    positionColors[assignPosition(player)].bg,
                                    positionColors[assignPosition(player)].text,
                                )}
                            >
                                {assignPosition(player)}
                            </span>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-3 md:mt-0">
                            <Link
                                to={`/admin/player/${player.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-indigo-500 border border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                            >
                                <Eye size={18} /> Ver Detalhes
                            </Link>

                            <Link
                                to={`/admin/edit/${player.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300"
                            >
                                <Pencil size={18} /> Editar
                            </Link>

                            <button
                                onClick={() =>
                                    removeMutation.mutate(player.id!)
                                }
                                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                <Trash2 size={18} /> Remover
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
