import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService";
import { evaluationService } from "../services/evaluationService";
import { Evaluation, Game } from "../types/game";
import { HelpCircle } from "lucide-react";
import { EvaluationHelpModal } from "./EvaluationHelpModal";
import { Loading } from "./loading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { iconMapping } from "../constants.tsx";

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
    const [showHelp, setShowHelp] = useState(false);
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

    // Busca as avaliações já realizadas pelo avaliador atual para este jogo
    const { data: evaluationsByEvaluator } = useQuery<Evaluation[]>({
        queryKey: ["evaluations", gameId, evaluatorId],
        enabled: !!gameId && !!evaluatorId,
        queryFn: async () => {
            const evaluations = await evaluationService.getEvaluationsByGameId(
                gameId!,
            );
            return evaluations.filter((ev) => ev.evaluatorId === evaluatorId);
        },
    });

    // Mutação para criar a avaliação
    const createEvaluationMutation = useMutation({
        mutationFn: async (evaluation: Evaluation) => {
            await evaluationService.createEvaluation(evaluation);
        },
        onSuccess: () => {
            toast.success("Avaliação salva com sucesso!");
            navigate(-1);
        },
        onError: () => toast.error("Erro ao salvar avaliação"),
    });

    const removeEvaluationByPlayerIdMutation = useMutation({
        mutationFn: async (playerId: string) => {
            await evaluationService.removeEvaluationByPlayerId(playerId);
        },
        onSuccess: () => {
            toast.success("Avaliações removidas com sucesso!");
        },
        onError: () => toast.error("Erro ao remover avaliações"),
    });

    if (isLoading) return <Loading />;
    if (isError || !gameData) return <p>Erro ao carregar o jogo</p>;

    // Lista de jogadores do jogo
    const players = gameData.players || [];

    // Filtra os companheiros do avaliador selecionado
    const teammates = () => {
        if (!evaluatorId) return [];
        const team = gameData.teams?.find((team) =>
            team.players.some((player) => player.id === evaluatorId),
        );
        if (!team) return [];
        return team.players.filter((player) => player.id !== evaluatorId);
    };

    // Lista dos jogadores que ainda não foram avaliados pelo avaliador
    const pendingEvaluations = evaluatorId
        ? teammates().filter(
              (player) =>
                  !evaluationsByEvaluator?.some(
                      (ev) => ev.evaluatedId === player.id,
                  ),
          )
        : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameId || !evaluatorId || !teammateId) {
            toast.error("Selecione o avaliador e o jogador a ser avaliado.");
            return;
        }
        const alreadyEvaluated = evaluationsByEvaluator?.some(
            (ev) => ev.evaluatedId === teammateId,
        );
        if (alreadyEvaluated) {
            toast.error("Você já avaliou esse jogador.");
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
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <div className="bg-gray-100 py-4">
                    <div className="text-center text-2xl font-bold text-gray-800">
                        Iniciar Avaliação
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        {evaluatorId
                            ? "Preencha os dados abaixo para avaliar seu companheiro."
                            : "Selecione quem você é para iniciar a avaliação."}
                    </p>
                </div>
                <Button
                    className={"my-4"}
                    variant="ghost"
                    onClick={() => setShowHelp(true)}
                >
                    <HelpCircle className="text-primary h-5 w-5" />
                    <span>Como funciona a avaliação?</span>
                </Button>
                <div className="space-y-6">
                    <EvaluationHelpModal
                        isOpen={showHelp}
                        onClose={() => setShowHelp(false)}
                    />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Seletor do avaliador */}
                        <div>
                            <label className="mb-2 block font-medium">
                                Selecione quem você é:
                            </label>
                            <select
                                value={evaluatorId}
                                onChange={(e) => {
                                    setEvaluatorId(e.target.value);
                                    setTeammateId("");
                                }}
                                className="w-full rounded-md border p-2"
                            >
                                <option value="">Selecione...</option>
                                {players.map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Seletor do companheiro a ser avaliado */}
                        {evaluatorId && (
                            <div>
                                <label className="mb-2 block font-medium">
                                    Selecione o jogador a ser avaliado:
                                </label>
                                <select
                                    value={teammateId}
                                    onChange={(e) =>
                                        setTeammateId(e.target.value)
                                    }
                                    className="w-full rounded-md border p-2"
                                >
                                    <option value="">Selecione...</option>
                                    {teammates().map((player) => {
                                        const alreadyEvaluated =
                                            evaluationsByEvaluator?.some(
                                                (ev) =>
                                                    ev.evaluatedId ===
                                                    player.id,
                                            );
                                        return (
                                            <option
                                                key={player.id}
                                                value={player.id}
                                                disabled={alreadyEvaluated}
                                            >
                                                {player.name}{" "}
                                                {alreadyEvaluated
                                                    ? "(Avaliado)"
                                                    : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        {/* Exibição dos jogadores pendentes de avaliação */}
                        {evaluatorId && (
                            <div>
                                <h3 className="mb-2 text-lg font-bold">
                                    Jogadores pendentes de avaliação
                                </h3>
                                {pendingEvaluations.length > 0 ? (
                                    <ul className="list-inside list-disc">
                                        {pendingEvaluations.map((player) => (
                                            <li key={player.id}>
                                                {player.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">
                                        Você já avaliou todos os seus
                                        companheiros.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Formulário de avaliação */}
                        {teammateId && (
                            <div className="space-y-4">
                                <h3 className="mb-2 text-lg font-bold">
                                    Avalie os seguintes aspectos:
                                </h3>
                                {Object.keys(ratings).map((stat) => (
                                    <div
                                        key={stat}
                                        className="flex items-center gap-3"
                                    >
                                        {
                                            iconMapping[
                                                stat as keyof typeof iconMapping
                                            ]
                                        }
                                        <label className="w-40 font-medium">
                                            {
                                                labelsLiteral[
                                                    stat as keyof typeof labelsLiteral
                                                ]
                                            }
                                        </label>
                                        <Input
                                            type="number"
                                            value={(ratings as any)[stat]}
                                            onChange={(e) =>
                                                setRatings((prev) => ({
                                                    ...prev,
                                                    [stat]: Number(
                                                        e.target.value,
                                                    ),
                                                }))
                                            }
                                            max="5"
                                            className="w-20"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={"flex w-full gap-2"}>
                            <Button
                                type="submit"
                                className={"flex-1"}
                                disabled={createEvaluationMutation.isPending}
                            >
                                {createEvaluationMutation.isPending
                                    ? "Salvando..."
                                    : "Salvar Avaliação"}
                            </Button>
                            <Button
                                variant={"outline"}
                                className={"flex-1"}
                                type="submit"
                                onClick={() =>
                                    removeEvaluationByPlayerIdMutation.mutate(
                                        evaluatorId,
                                    )
                                }
                                disabled={
                                    removeEvaluationByPlayerIdMutation.isPending ||
                                    !evaluatorId
                                }
                            >
                                {removeEvaluationByPlayerIdMutation.isPending
                                    ? "Removendo..."
                                    : "Remover Avaliaçôes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
