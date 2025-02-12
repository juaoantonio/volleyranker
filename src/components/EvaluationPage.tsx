import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService";
import { evaluationService } from "../services/evaluationService";
import { Evaluation, Game } from "../types/game";

const labelsLiteral = {
    attack: "Ataque",
    serve: "Eficiência no Saque",
    set: "Levantamento",
    defense: "Defesa",
    positioning: "Posicionamento",
    reception: "Recepção",
    consistency: "Constância",
    block: "Bloqueio",
};
export const EvaluationPage = () => {
    const { id: gameId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState<Game | null>(null);
    const [evaluatorId, setEvaluatorId] = useState<string>("");
    const [teammateId, setTeammateId] = useState<string>("");
    const [ratings, setRatings] = useState({
        attack: 5,
        serve: 5,
        set: 5,
        defense: 5,
        positioning: 5,
        reception: 5,
        consistency: 5,
        block: 5,
    });

    // Carrega os dados do jogo
    const { isLoading, isError } = useQuery({
        queryKey: ["game", gameId],
        enabled: !!gameId,
        queryFn: async () => {
            const game = await gameService.getGameById(gameId!);
            setGameData(game);
            return game;
        },
    });

    // Mutação para criar a avaliação
    const createEvaluationMutation = useMutation({
        mutationFn: async (evaluation: Evaluation) => {
            await evaluationService.createEvaluation(evaluation);
        },
        onSuccess: () => {
            toast.success("Avaliação salva com sucesso!");
            navigate(`/games/${gameId}`);
        },
        onError: () => toast.error("Erro ao salvar avaliação"),
    });

    if (isLoading) return <p>Carregando...</p>;
    if (isError || !gameData) return <p>Erro ao carregar o jogo</p>;

    // Lista de jogadores do jogo para o seletor de “eu sou”
    const players = gameData.players || [];

    // Ao selecionar o avaliador, filtra os companheiros (mesmo time)
    const teammates = () => {
        if (!evaluatorId) return [];
        const team = gameData.teams?.find((team) =>
            team.players.some((player) => player.id === evaluatorId),
        );
        if (!team) return [];
        return team.players.filter((player) => player.id !== evaluatorId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameId || !evaluatorId || !teammateId) {
            toast.error("Selecione o avaliador e o jogador a ser avaliado.");
            return;
        }
        const evaluation: Evaluation = {
            gameId,
            evaluatorId,
            evaluatedId: teammateId,
            ratings,
            createdAt: new Date().toISOString(),
        };

        createEvaluationMutation.mutate(evaluation);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Iniciar Avaliação</h2>
            <form onSubmit={handleSubmit}>
                {/* Seleciona quem você é */}
                <div className="mb-4">
                    <label className="block font-medium mb-2">
                        Selecione quem você é:
                    </label>
                    <select
                        value={evaluatorId}
                        onChange={(e) => setEvaluatorId(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Selecione...</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Seleciona o jogador a ser avaliado (somente companheiros) */}
                {evaluatorId && (
                    <div className="mb-4">
                        <label className="block font-medium mb-2">
                            Selecione o jogador a ser avaliado:
                        </label>
                        <select
                            value={teammateId}
                            onChange={(e) => setTeammateId(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="">Selecione...</option>
                            {teammates().map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Formulário de avaliação */}
                {teammateId && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">
                            Avalie os seguintes aspectos:
                        </h3>
                        {Object.keys(ratings).map((stat) => (
                            <div key={stat} className="mb-2">
                                <label className="block font-medium mb-1">
                                    {
                                        labelsLiteral[
                                            stat as keyof typeof labelsLiteral
                                        ]
                                    }
                                </label>

                                <input
                                    type="number"
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    value={(ratings as any)[stat]}
                                    onChange={(e) =>
                                        setRatings((prev) => ({
                                            ...prev,
                                            [stat]: Number(e.target.value),
                                        }))
                                    }
                                    max="5"
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={createEvaluationMutation.isPending}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {createEvaluationMutation.isPending
                        ? "Salvando..."
                        : "Salvar Avaliação"}
                </button>
            </form>
        </div>
    );
};
