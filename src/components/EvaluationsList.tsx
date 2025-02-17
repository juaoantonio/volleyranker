import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { evaluationService } from "../services/evaluationService";
import { gameService } from "../services/gameService";
import { Evaluation, Game } from "../types/game";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eraser,
    Loader,
    Star,
    User,
    Users,
} from "lucide-react";
import { labelsLiteral } from "../constants";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

export const EvaluationsList = () => {
    const { id: gameId } = useParams<{ id: string }>();
    const [gameData, setGameData] = useState<Game | null>(null);
    const [searchFilters, setSearchFilters] = useState({
        evaluator: "",
        evaluated: "",
    });
    const [showEvaluatedList, setShowEvaluatedList] = useState(false);
    const [showPendingList, setShowPendingList] = useState(false);

    // Busca os dados do jogo
    const { isLoading: isLoadingGame, isError: isErrorGame } = useQuery({
        queryKey: ["game", gameId],
        enabled: !!gameId,
        queryFn: async () => {
            const game = await gameService.getGameById(gameId!);
            setGameData(game);
            return game;
        },
    });

    // Busca as avaliações do jogo
    const {
        data: evaluations,
        isLoading: isLoadingEvaluations,
        isError: isErrorEvaluations,
    } = useQuery<Evaluation[]>({
        queryKey: ["evaluations", gameId],
        enabled: !!gameId,
        queryFn: async () => evaluationService.getEvaluationsByGameId(gameId!),
    });

    if (isLoadingGame || isLoadingEvaluations) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    if (isErrorGame || isErrorEvaluations || !gameData) {
        return (
            <p className="py-10 text-center text-red-500">
                Erro ao carregar dados do jogo.
            </p>
        );
    }

    const players = gameData.players;

    // Lista de IDs dos jogadores que concluíram todas as avaliações
    const playersWhoEvaluated = new Set(
        gameData.teams?.flatMap((team) =>
            team.players
                .filter((player) => {
                    const teammates = team.players
                        .filter((p) => p.id !== player.id)
                        .map((p) => p.id);
                    return teammates.every((teammateId) =>
                        evaluations?.some(
                            (evalItem) =>
                                evalItem.evaluatorId === player.id &&
                                evalItem.evaluatedId === teammateId,
                        ),
                    );
                })
                .map((player) => player.id),
        ),
    );

    // Lista de jogadores que ainda precisam concluir suas avaliações
    const playersPendingEvaluations = gameData.teams?.flatMap((team) =>
        team.players.filter((player) => !playersWhoEvaluated.has(player.id)),
    );

    // Filtro avançado para avaliações
    const filteredEvaluations = evaluations?.filter((evaluation) => {
        const evaluatorName =
            players?.find((p) => p.id === evaluation.evaluatorId)?.name || "";
        const evaluatedName =
            players?.find((p) => p.id === evaluation.evaluatedId)?.name || "";
        return (
            evaluatorName
                .toLowerCase()
                .includes(searchFilters.evaluator.toLowerCase()) &&
            evaluatedName
                .toLowerCase()
                .includes(searchFilters.evaluated.toLowerCase())
        );
    });

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
            {/* Cabeçalho com filtros e resumo de estatísticas */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Avaliações do Jogo
                    </h1>
                    <div className="flex w-full flex-col gap-2 md:flex-row">
                        <Input
                            type="text"
                            placeholder="Buscar Avaliador"
                            value={searchFilters.evaluator}
                            onChange={(e) =>
                                setSearchFilters({
                                    ...searchFilters,
                                    evaluator: e.target.value,
                                })
                            }
                            className="w-full md:w-auto"
                        />
                        <Input
                            type="text"
                            placeholder="Buscar Avaliado"
                            value={searchFilters.evaluated}
                            onChange={(e) =>
                                setSearchFilters({
                                    ...searchFilters,
                                    evaluated: e.target.value,
                                })
                            }
                            className="w-full md:w-auto"
                        />
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                                setSearchFilters({
                                    evaluator: "",
                                    evaluated: "",
                                })
                            }
                        >
                            <Eraser size={18} />
                            Limpar
                        </Button>
                    </div>
                </div>

                {/* Seção de estatísticas rápidas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Card
                            onClick={() =>
                                setShowEvaluatedList(!showEvaluatedList)
                            }
                            className="cursor-pointer border border-green-100 bg-green-50"
                        >
                            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div className="text-center">
                                    <p className="text-sm text-green-600">
                                        Concluíram
                                    </p>
                                    <p className="text-xl font-bold">
                                        {playersWhoEvaluated.size}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        {showEvaluatedList && (
                            <Card className="mt-2">
                                <CardContent>
                                    <ul className="list-disc space-y-1 pl-5">
                                        {Array.from(playersWhoEvaluated).map(
                                            (playerId) => {
                                                const player = players?.find(
                                                    (p) => p.id === playerId,
                                                );
                                                return player ? (
                                                    <li
                                                        key={player.id}
                                                        className="text-gray-800"
                                                    >
                                                        {player.name}
                                                    </li>
                                                ) : null;
                                            },
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div>
                        <Card
                            onClick={() => setShowPendingList(!showPendingList)}
                            className="cursor-pointer border border-red-100 bg-red-50"
                        >
                            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                                <div className="text-center">
                                    <p className="text-sm text-red-600">
                                        Pendentes
                                    </p>
                                    <p className="text-xl font-bold">
                                        {playersPendingEvaluations?.length || 0}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        {showPendingList && (
                            <Card className="mt-2">
                                <CardContent>
                                    <ul className="list-disc space-y-1 pl-5">
                                        {playersPendingEvaluations?.map(
                                            (player) => (
                                                <li
                                                    key={player.id}
                                                    className="text-gray-800"
                                                >
                                                    {player.name}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div>
                        <Card className="border border-blue-100 bg-blue-50">
                            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div className="text-center">
                                    <p className="text-sm text-blue-600">
                                        Total Jogadores
                                    </p>
                                    <p className="text-xl font-bold">
                                        {players?.length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Seção: Histórico de Avaliações (a prioridade) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                        <Users className="h-6 w-6" />
                        Histórico de Avaliações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredEvaluations && filteredEvaluations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            <User className="mr-1 inline-block" />
                                            Avaliador
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            <User className="mr-1 inline-block" />
                                            Avaliado
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            <Star className="mr-1 inline-block" />
                                            Notas
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            <Clock className="mr-1 inline-block" />
                                            Data
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100">
                                    {filteredEvaluations.map((evaluation) => {
                                        const evaluator =
                                            players?.find(
                                                (p) =>
                                                    p.id ===
                                                    evaluation.evaluatorId,
                                            )?.name || "Desconhecido";
                                        const evaluated =
                                            players?.find(
                                                (p) =>
                                                    p.id ===
                                                    evaluation.evaluatedId,
                                            )?.name || "Desconhecido";
                                        return (
                                            <TableRow
                                                key={`${evaluation.evaluatorId}-${evaluation.evaluatedId}`}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <TableCell className="px-4 py-3 text-sm text-gray-700">
                                                    {evaluator}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-gray-700">
                                                    {evaluated}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-gray-700">
                                                    <ul className="space-y-1">
                                                        {Object.entries(
                                                            evaluation.ratings,
                                                        ).map(
                                                            ([
                                                                aspect,
                                                                score,
                                                            ]) => (
                                                                <li
                                                                    key={aspect}
                                                                >
                                                                    <span className="font-semibold">
                                                                        {
                                                                            labelsLiteral[
                                                                                aspect as keyof typeof labelsLiteral
                                                                            ]
                                                                        }
                                                                    </span>
                                                                    : {score}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-gray-600">
                                                    {new Date(
                                                        evaluation.createdAt,
                                                    ).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Nenhuma avaliação foi encontrada com os filtros
                            aplicados.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
