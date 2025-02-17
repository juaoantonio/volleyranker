import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService.ts";
import {
    CheckCircle,
    Clock,
    Dices,
    DollarSign,
    Eye,
    Trash2,
} from "lucide-react";
import { queryClient } from "../main.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { Loading } from "./loading.tsx";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

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
            queryClient.invalidateQueries({ queryKey: ["games"] });
        }
    };

    if (isPending) return <Loading />;

    if (isError)
        return (
            <p className="text-center">Não foi possível carregar os jogos.</p>
        );

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-center gap-3 text-center text-xl font-bold text-gray-800">
                <Dices className="text-primary" />
                <span>Lista de Jogos</span>
            </div>

            {/* Caso não haja jogos */}
            {games.length === 0 ? (
                <Card className="mx-auto shadow-lg">
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">Nenhum jogo cadastrado.</p>
                    </CardContent>
                </Card>
            ) : (
                // Grid de jogos
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {games.map((game) => {
                        const totalPlayers = game.players?.length;
                        const paidCount = game.payments?.filter(
                            (p) => p.hasPaid,
                        ).length;
                        return (
                            <Card
                                key={game.id}
                                className="border-primary flex w-full cursor-pointer flex-col items-center gap-4 p-4 transition-shadow hover:shadow-lg md:flex-row md:justify-between"
                            >
                                <CardContent className={"w-full p-0"}>
                                    <CardTitle className="text-primary mb-4 text-2xl font-bold">
                                        {game.date
                                            ? `Jogo em ${new Date(game.date).toLocaleDateString()}`
                                            : "Não definido"}
                                    </CardTitle>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                            <span>
                                                <strong>Início:</strong>{" "}
                                                {game.startTime ||
                                                    "Não definido"}
                                            </span>{" "}
                                            |{" "}
                                            <span>
                                                <strong>Término:</strong>{" "}
                                                {game.endTime || "Não definido"}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700">
                                            <DollarSign className="h-5 w-5 text-gray-500" />
                                            <span>
                                                <strong>Taxa:</strong>{" "}
                                                {game.gameFee
                                                    ? `R$ ${game.gameFee.toFixed(2)}`
                                                    : "Não definido"}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2 font-semibold text-green-600">
                                            <CheckCircle className="h-5 w-5" />
                                            <span>
                                                Pagamentos: {paidCount} /{" "}
                                                {totalPlayers}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="mt-6 flex w-full items-center justify-stretch gap-2">
                                        <Button asChild variant="outline">
                                            <Link
                                                to={`/games/${game.id}`}
                                                className="flex flex-1 items-center gap-2"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                        {user && (
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDeleteGame(game.id!)
                                                }
                                                disabled={
                                                    deleteMutation.isPending
                                                }
                                                className="flex flex-1 items-center gap-2"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
