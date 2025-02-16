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
    Loader,
    Star,
    User,
    Users,
} from "lucide-react";
import { labelsLiteral } from "../constants.tsx";

export const EvaluationsList = () => {
    const { id: gameId } = useParams<{ id: string }>();
    const [gameData, setGameData] = useState<Game | null>(null);
    const [searchFilters, setSearchFilters] = useState({
        evaluator: "",
        evaluated: "",
    });

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
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    if (isErrorGame || isErrorEvaluations || !gameData) {
        return (
            <p className="text-center text-red-500 py-10">
                Erro ao carregar dados do jogo.
            </p>
        );
    }

    const players = gameData.players;

    // Jogadores que já completaram as avaliações
    const playersWhoEvaluated = new Set(
        evaluations?.map((evalItem) => evalItem.evaluatorId),
    );

    // Jogadores que ainda precisam avaliar seus companheiros
    const playersPendingEvaluations = gameData.teams?.flatMap((team) =>
        team.players.filter(
            (player) =>
                !evaluations?.some(
                    (evalItem) =>
                        evalItem.evaluatorId === player.id &&
                        team.players.every((p) =>
                            evaluations.some(
                                (e) =>
                                    e.evaluatorId === player.id &&
                                    e.evaluatedId === p.id,
                            ),
                        ),
                ),
        ),
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
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Cabeçalho com Busca Avançada */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Avaliações do Jogo
                </h2>
                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Buscar Avaliador"
                        value={searchFilters.evaluator}
                        onChange={(e) =>
                            setSearchFilters({
                                ...searchFilters,
                                evaluator: e.target.value,
                            })
                        }
                        className="border border-gray-300 bg-gray-50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                        type="text"
                        placeholder="Buscar Avaliado"
                        value={searchFilters.evaluated}
                        onChange={(e) =>
                            setSearchFilters({
                                ...searchFilters,
                                evaluated: e.target.value,
                            })
                        }
                        className="border border-gray-300 bg-gray-50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setSearchFilters({ evaluator: "", evaluated: "" })
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        Limpar
                    </button>
                </div>
            </header>

            {/* Seção: Jogadores que Concluíram as Avaliações */}
            <section>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-green-600 mb-4">
                    <CheckCircle className="w-6 h-6" />
                    Jogadores que concluíram suas avaliações
                </h3>
                {playersWhoEvaluated.size > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from(playersWhoEvaluated).map((playerId) => {
                            const player = players?.find(
                                (p) => p.id === playerId,
                            );
                            return player ? (
                                <li
                                    key={player.id}
                                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm transition hover:shadow-md"
                                >
                                    <CheckCircle className="text-green-600" />
                                    <span className="text-gray-800 font-medium">
                                        {player.name}
                                    </span>
                                </li>
                            ) : null;
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        Nenhum jogador concluiu todas as avaliações.
                    </p>
                )}
            </section>

            {/* Seção: Jogadores que Ainda Precisam Avaliar */}
            <section>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-red-600 mb-4">
                    <AlertCircle className="w-6 h-6" />
                    Jogadores que ainda precisam avaliar seus companheiros
                </h3>
                {playersPendingEvaluations &&
                playersPendingEvaluations.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {playersPendingEvaluations.map((player) => (
                            <li
                                key={player.id}
                                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm transition hover:shadow-md"
                            >
                                <AlertCircle className="text-red-600" />
                                <span className="text-gray-800 font-medium">
                                    {player.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        Todos os jogadores avaliaram.
                    </p>
                )}
            </section>

            {/* Seção: Histórico de Avaliações */}
            <section>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4">
                    <Users className="w-6 h-6" />
                    Histórico de Avaliações
                </h3>
                {filteredEvaluations && filteredEvaluations.length > 0 ? (
                    <div className="overflow-x-auto bg-white rounded-lg shadow border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        <User className="inline-block mr-1" />
                                        Avaliador
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        <User className="inline-block mr-1" />
                                        Avaliado
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        <Star className="inline-block mr-1" />
                                        Notas
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        <Clock className="inline-block mr-1" />
                                        Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEvaluations.map((evaluation) => {
                                    const evaluator =
                                        players?.find(
                                            (p) =>
                                                p.id === evaluation.evaluatorId,
                                        )?.name || "Desconhecido";
                                    const evaluated =
                                        players?.find(
                                            (p) =>
                                                p.id === evaluation.evaluatedId,
                                        )?.name || "Desconhecido";
                                    return (
                                        <tr
                                            key={`${evaluation.evaluatorId}-${evaluation.evaluatedId}`}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {evaluator}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {evaluated}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <ul className="space-y-1">
                                                    {Object.entries(
                                                        evaluation.ratings,
                                                    ).map(([aspect, score]) => (
                                                        <li key={aspect}>
                                                            <span className="font-semibold">
                                                                {
                                                                    labelsLiteral[
                                                                        aspect as keyof typeof labelsLiteral
                                                                    ]
                                                                }
                                                            </span>
                                                            : {score}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(
                                                    evaluation.createdAt,
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        Nenhuma avaliação foi encontrada com os filtros
                        aplicados.
                    </p>
                )}
            </section>
        </div>
    );
};
