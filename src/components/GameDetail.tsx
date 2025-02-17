import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService.ts";
import { Evaluation, Game } from "../types/game.ts";
import { TeamCard } from "./TeamCard.tsx";
import { useTeamStore } from "../store/useTeamStore.ts";
import { evaluationService } from "../services/evaluationService.ts";
import { updatePlayer } from "../services/firebase.ts";
import { Player } from "../types/player.ts";
import { calculateRelativeAdjustments } from "../utils.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { Loading } from "./loading.tsx";

// Componentes shadcn UI
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Ícones do Lucide
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Play,
    Save,
    Trash2,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx";

export const GameDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setTeams, teams } = useTeamStore();
    const [gameData, setGameData] = useState<Game | null>(null);

    // Consulta do jogo pelo ID
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

    // Mutação para atualizar o jogo
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

    // Mutação para deletar o jogo
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await gameService.deleteGame(id!);
        },
        onSuccess: () => {
            toast.success("Jogo removido com sucesso! ✅");
            navigate("/");
        },
        onError: () => toast.error("Erro ao remover o jogo ❌"),
    });

    useEffect(() => {
        if (!teams) return;
        setGameData((prev) => (prev ? { ...prev, teams: teams } : null));
    }, [teams]);

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

    const handleApplyEvaluations = async () => {
        if (!gameData) return;
        try {
            // Busca todas as avaliações do jogo
            const evaluations = await evaluationService.getEvaluationsByGameId(
                gameData.id!,
            );
            // Agrupa as avaliações por jogador avaliado
            const evaluationsByPlayer = evaluations.reduce(
                (acc, evaluation) => {
                    if (!acc[evaluation.evaluatedId]) {
                        acc[evaluation.evaluatedId] = [];
                    }
                    acc[evaluation.evaluatedId].push(evaluation);
                    return acc;
                },
                {} as Record<string, Evaluation[]>,
            );

            // Processa as avaliações para cada jogador
            for (const playerId in evaluationsByPlayer) {
                const evals = evaluationsByPlayer[playerId];
                const player = gameData.players?.find((p) => p.id === playerId);
                if (!player) continue;

                const adjustments = calculateRelativeAdjustments(
                    evals,
                    {
                        attack: player.attack,
                        serve: player.serve,
                        set: player.set,
                        defense: player.defense,
                        positioning: player.positioning,
                        reception: player.reception,
                        consistency: player.consistency,
                        block: player.block,
                    },
                    0.1,
                );

                const updatedPlayer: Player = {
                    ...player,
                    attack: player.attack + adjustments.attack,
                    serve: player.serve + adjustments.serve,
                    set: player.set + adjustments.set,
                    defense: player.defense + adjustments.defense,
                    positioning: player.positioning + adjustments.positioning,
                    reception: player.reception + adjustments.reception,
                    consistency: player.consistency + adjustments.consistency,
                    block: player.block + adjustments.block,
                };

                await updatePlayer(updatedPlayer.id!, updatedPlayer);
            }

            toast.success("Avaliações aplicadas com sucesso!");
            await evaluationService.removeAllEvaluationsByGameId(gameData.id!);
        } catch (error) {
            toast.error("Erro ao aplicar avaliações");
            console.error(error);
        }
    };

    if (isPending) return <Loading />;
    if (isError)
        return <p className="text-center">Não foi possível encontrar o jogo</p>;

    const paidCount = gameData?.payments?.filter((p) => p.hasPaid).length || 0;
    const totalPlayers = gameData?.players?.length || 0;

    return (
        <div className="mx-auto max-w-5xl space-y-4">
            <div>
                <div className="text-center text-xl font-bold text-gray-800">
                    {user ? "⚡ Editar Detalhes do Jogo" : "Detalhes do Jogo"}
                </div>
                {!user && (
                    <p className="text-center text-sm text-gray-600">
                        Você está visualizando apenas os detalhes do jogo.
                    </p>
                )}
            </div>
            <div className="space-y-6">
                {/* Contador de pagamentos */}
                <div className="text-center text-lg font-semibold text-green-600">
                    <CheckCircle className="mr-2 inline-block h-6 w-6" />
                    Pagamentos: {paidCount} / {totalPlayers}
                </div>

                {/* Lista de jogadores e pagamentos */}
                <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-700">
                        Jogadores e Pagamentos
                    </h3>
                    <ul className="max-h-64 space-y-2 overflow-auto rounded-lg border bg-gray-50 p-4">
                        {gameData?.players?.map((player) => {
                            const payment = gameData?.payments?.find(
                                (p) => p.playerId === player.id,
                            );
                            return (
                                <li
                                    key={player.id}
                                    className="flex items-center justify-between rounded-md border bg-white p-2 shadow-sm"
                                >
                                    <Avatar className="h-8 w-8">
                                        {player.imageUrl ? (
                                            <>
                                                <AvatarImage
                                                    src={player.imageUrl}
                                                    alt={player.name}
                                                />
                                                <AvatarFallback>
                                                    {player.name[0]}
                                                </AvatarFallback>
                                            </>
                                        ) : (
                                            <AvatarFallback>
                                                <User
                                                    size={20}
                                                    className="text-gray-500"
                                                />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="font-semibold">
                                        {player.name}
                                    </span>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            disabled={!user}
                                            checked={payment?.hasPaid || false}
                                            onChange={() =>
                                                handleTogglePayment(player.id!)
                                            }
                                            className="h-5 w-5"
                                        />
                                        <span className="text-sm">Pago</span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Inputs de data e horário */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            <Calendar className="mr-1 inline-block h-5 w-5 text-gray-500" />
                            Data do Jogo:
                        </label>
                        <Input
                            type="date"
                            disabled={!user}
                            value={
                                gameData?.date
                                    ? new Date(gameData.date)
                                          .toISOString()
                                          .split("T")[0]
                                    : ""
                            }
                            onChange={(e) => {
                                const selectedDate = new Date(
                                    e.target.value + "T00:00:00-03:00",
                                );
                                const utcDate = new Date(
                                    selectedDate.getTime(),
                                ).toISOString();
                                setGameData({
                                    ...gameData!,
                                    date: utcDate,
                                });
                            }}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            <Clock className="mr-1 inline-block h-5 w-5 text-gray-500" />
                            Horário de Início:
                        </label>
                        <Input
                            type="time"
                            disabled={!user}
                            value={gameData?.startTime ?? ""}
                            onChange={(e) =>
                                setGameData({
                                    ...gameData!,
                                    startTime: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            <Clock className="mr-1 inline-block h-5 w-5 text-gray-500" />
                            Horário de Término:
                        </label>
                        <Input
                            type="time"
                            disabled={!user}
                            value={gameData?.endTime ?? ""}
                            onChange={(e) =>
                                setGameData({
                                    ...gameData!,
                                    endTime: e.target.value,
                                })
                            }
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Taxa do jogo */}
                <div>
                    <label className="mb-1 block font-medium text-gray-700">
                        <DollarSign className="mr-1 inline-block h-5 w-5 text-gray-500" />
                        Taxa do Jogo (R$):
                    </label>
                    <Input
                        type="number"
                        disabled={!user}
                        value={gameData?.gameFee}
                        onChange={(e) =>
                            setGameData({
                                ...gameData!,
                                gameFee: Number(e.target.value),
                            })
                        }
                        min="0"
                        className="w-full"
                    />
                </div>

                {/* Listagem dos times */}
                <div>
                    <h3 className="mb-2 text-lg font-bold text-gray-700">
                        Times Criados
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {gameData?.teams?.map((team, index) => (
                            <TeamCard key={index} team={team} index={index} />
                        ))}
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col gap-4 pb-4 md:flex-row md:justify-between">
                    <Button
                        onClick={() => navigate(`/games/${id}/evaluation`)}
                        variant="outline"
                        className="flex w-full items-center gap-2 md:w-auto"
                    >
                        <Play className="h-5 w-5" />
                        Iniciar Avaliação
                    </Button>
                    {user && (
                        <>
                            <Button
                                onClick={handleDeleteGame}
                                variant="destructive"
                                disabled={deleteMutation.isPending}
                                className="flex w-full items-center gap-2 md:w-auto"
                            >
                                <Trash2 className="h-5 w-5" />
                                {deleteMutation.isPending
                                    ? "Removendo..."
                                    : "Excluir Jogo"}
                            </Button>
                            <Button
                                onClick={handleApplyEvaluations}
                                variant="outline"
                                className="flex w-full items-center gap-2 md:w-auto"
                            >
                                <CheckCircle className="h-5 w-5" />
                                Aplicar Avaliações
                            </Button>
                            <Button
                                onClick={handleUpdateGame}
                                disabled={updateMutation.isPending}
                                variant="success"
                                className="flex w-full items-center gap-2 md:w-auto"
                            >
                                <Save className="h-5 w-5" />
                                {updateMutation.isPending
                                    ? "Salvando..."
                                    : "Salvar Alterações"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
