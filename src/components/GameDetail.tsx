import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService.ts";
import { Game } from "../types/game.ts";
import { TeamCard } from "./TeamCard.tsx";
import { useTeamStore } from "../store/useTeamStore.ts";

export const GameDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setTeams, teams } = useTeamStore();
    const [gameData, setGameData] = useState<Game | null>(null);

    // Busca o jogo no Firestore pelo ID
    const { isPending, isError } = useQuery({
        queryKey: ["game", id],
        enabled: !!id,
        queryFn: async () => {
            const game = await gameService.getGameById(id!);
            setGameData(game);
            setTeams(game?.teams);
            return game;
        },
    });

    // Mutação para atualizar o jogo no Firestore
    const updateMutation = useMutation({
        mutationFn: async (updatedGame: Game) => {
            await gameService.updateGame(id!, updatedGame);
        },
        onSuccess: () => {
            toast.success("Jogo atualizado com sucesso! ✅");
            navigate(`/games/${id}`);
        },
        onError: () => toast.error("Erro ao atualizar o jogo ❌"),
    });

    // Mutação para deletar o jogo do Firestore
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await gameService.deleteGame(id!);
        },
        onSuccess: () => {
            toast.success("Jogo removido com sucesso! ✅");
            navigate("/"); // Redireciona para a página inicial
        },
        onError: () => toast.error("Erro ao remover o jogo ❌"),
    });

    useEffect(() => {
        console.log(teams);
        if (!teams) return;
        setGameData((prev) => (prev ? { ...prev, teams: teams } : null));
    }, [teams, setGameData]);

    const handleUpdateGame = () => {
        if (!gameData) return;
        updateMutation.mutate(gameData);
    };

    const handleDeleteGame = () => {
        if (window.confirm("Tem certeza que deseja excluir este jogo?")) {
            deleteMutation.mutate();
        }
    };

    // Atualiza o estado do pagamento de um jogador
    const handleTogglePayment = (playerId: string) => {
        if (!gameData) return;

        const updatedPayments = gameData.payments?.map((payment) =>
            payment.playerId === playerId
                ? { ...payment, hasPaid: !payment.hasPaid }
                : payment,
        );

        setGameData((prev) =>
            prev ? { ...prev, payments: updatedPayments } : null,
        );
    };

    if (isPending) return <p className="text-center">Carregando...</p>;

    if (isError)
        return <p className="text-center">Não foi possível encontrar o jogo</p>;

    // Contador de jogadores que já pagaram
    const paidCount = gameData?.payments?.filter((p) => p.hasPaid).length || 0;
    const totalPlayers = gameData?.players?.length || 0;

    console.log(gameData);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    ⚡ Editar Detalhes do Jogo
                </h2>

                {/* Contador de pagamentos */}
                <div className="text-lg font-semibold text-center text-green-600 mb-4">
                    Pagamentos: {paidCount} / {totalPlayers}
                </div>

                {/* Lista de jogadores e pagamentos */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        Jogadores e Pagamentos:
                    </h3>
                    <ul className="border p-4 rounded-lg bg-gray-100 max-h-64 overflow-auto">
                        {gameData?.players?.map((player) => {
                            const payment = gameData?.payments?.find(
                                (p) => p.playerId === player.id,
                            );
                            return (
                                <li
                                    key={player.id}
                                    className="flex items-center justify-between bg-white p-2 rounded-md border shadow-sm mb-2"
                                >
                                    <span className="font-semibold">
                                        {player.name}
                                    </span>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={payment?.hasPaid || false}
                                            onChange={() =>
                                                handleTogglePayment(player.id!)
                                            }
                                            className="w-5 h-5"
                                        />
                                        <span className="text-sm">Pago</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Inputs de horário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Data do Jogo:
                        </label>
                        <input
                            type="date"
                            value={
                                gameData?.date
                                    ? new Date(gameData.date)
                                          .toISOString()
                                          .split("T")[0] // Exibe no formato YYYY-MM-DD
                                    : ""
                            }
                            onChange={(e) => {
                                const selectedDate = new Date(
                                    e.target.value + "T00:00:00-03:00",
                                ); // Garante UTC-3
                                const utcDate = new Date(
                                    selectedDate.getTime(),
                                ).toISOString(); // Converte para UTC

                                setGameData({
                                    ...gameData,
                                    date: utcDate,
                                });
                            }}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Horário de Início:
                        </label>
                        <input
                            type="time"
                            value={gameData?.startTime ?? ""}
                            onChange={(e) =>
                                setGameData({
                                    ...gameData,
                                    startTime: e.target.value,
                                })
                            }
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Horário de Término:
                        </label>
                        <input
                            type="time"
                            value={gameData?.endTime ?? ""}
                            onChange={(e) =>
                                setGameData({
                                    ...gameData,
                                    endTime: e.target.value,
                                })
                            }
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                </div>

                {/* Taxa do jogo */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-1">
                        Taxa do Jogo (R$):
                    </label>
                    <input
                        type="number"
                        value={gameData?.gameFee}
                        onChange={(e) =>
                            setGameData({
                                ...gameData,
                                gameFee: Number(e.target.value),
                            })
                        }
                        min="0"
                        className="border p-2 rounded-md w-full"
                    />
                </div>

                {/* Listagem dos times */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        Times Criados:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gameData?.teams?.map((team, index) => (
                            <TeamCard key={index} team={team} index={index} />
                        ))}
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleDeleteGame}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending
                            ? "Removendo..."
                            : "Excluir Jogo"}
                    </button>

                    <button
                        onClick={handleUpdateGame}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending
                            ? "Salvando..."
                            : "Salvar Alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
};
