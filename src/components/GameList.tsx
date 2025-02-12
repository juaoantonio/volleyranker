import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService.ts";
import { Eye, Trash2 } from "lucide-react";
import { queryClient } from "../main.tsx";
import { useAuth } from "../hooks/useAuth.ts";

export const GameList = () => {
    // Busca todos os jogos do Firestore
    const {
        data: games,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["games"],
        queryFn: gameService.getAllGames,
    });
    const { user } = useAuth();

    // Mutação para deletar um jogo do Firestore
    const deleteMutation = useMutation({
        mutationFn: async (gameId: string) => {
            await gameService.deleteGame(gameId);
        },
        onSuccess: () => {
            toast.success("Jogo removido com sucesso! ✅");
        },
        onError: () => toast.error("Erro ao remover o jogo ❌"),
    });

    const handleDeleteGame = (gameId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este jogo?")) {
            deleteMutation.mutate(gameId);
            queryClient.invalidateQueries({
                queryKey: ["games"],
            });
        }
    };

    if (isPending) return <p className="text-center">Carregando jogos...</p>;

    if (isError)
        return (
            <p className="text-center">Não foi possível carregar os jogos</p>
        );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                📋 Lista de Jogos
            </h2>

            {games.length === 0 ? (
                <p className="text-center text-gray-500">
                    Nenhum jogo cadastrado.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {games.map((game) => {
                        const totalPlayers = game.players?.length;
                        const paidCount = game.payments?.filter(
                            (p) => p.hasPaid,
                        ).length;

                        return (
                            <div
                                key={game.id}
                                className="border rounded-lg shadow-md p-4 bg-white flex flex-col gap-3"
                            >
                                <h3 className="text-xl font-bold text-blue-600">
                                    {game?.date
                                        ? `Jogo em ${new Date(game.date).toLocaleDateString()}`
                                        : "Não definido"}
                                </h3>
                                <p className="text-gray-700">
                                    🕒 <strong>Início:</strong>{" "}
                                    {game.startTime || "Não definido"} |{" "}
                                    <strong>Término:</strong>{" "}
                                    {game.endTime || "Não definido"}
                                </p>
                                <p className="text-gray-700">
                                    💰 <strong>Taxa:</strong>{" "}
                                    {game?.gameFee
                                        ? `R$ ${game.gameFee.toFixed(2)}`
                                        : "Não definido"}
                                </p>
                                <p className="text-green-600 font-semibold">
                                    ✅ Pagamentos: {paidCount} / {totalPlayers}
                                </p>

                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        to={`/games/${game.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    >
                                        <Eye className="w-5 h-5" />
                                        Ver Detalhes
                                    </Link>

                                    {user && (
                                        <button
                                            onClick={() =>
                                                handleDeleteGame(game.id!)
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
