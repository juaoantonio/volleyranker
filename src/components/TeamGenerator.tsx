import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { useTeamStore } from "../store/useTeamStore";
import { Player } from "../types/player.ts";
import { calculateOverall } from "../utils.ts";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { gameService } from "../services/gameService.ts";
import { Game } from "../types/game.ts";
import { TeamCard } from "./TeamCard.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { Button } from "./ui/button.tsx";

export const TeamGenerator = () => {
    const { players } = usePlayers();
    const navigate = useNavigate();
    const { teams, generateTeams } = useTeamStore();
    const [teamSize, setTeamSize] = useState(4);
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlayers = (players ?? []).filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const allFilteredSelected =
        filteredPlayers.length > 0 &&
        filteredPlayers.every((player) =>
            selectedPlayers.some((p) => p.id === player.id),
        );

    const handleSelectPlayer = (player: Player) => {
        setSelectedPlayers((prev) =>
            prev.some((p) => p.id === player.id)
                ? prev.filter((p) => p.id !== player.id)
                : [...prev, player],
        );
    };

    const handleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedPlayers((prev) =>
                prev.filter(
                    (player) =>
                        !filteredPlayers.some(
                            (filteredPlayer) => filteredPlayer.id === player.id,
                        ),
                ),
            );
        } else {
            setSelectedPlayers((prev) => {
                const union = [...prev];
                filteredPlayers.forEach((player) => {
                    if (!prev.some((p) => p.id === player.id)) {
                        union.push(player);
                    }
                });
                return union;
            });
        }
    };

    // Agora usamos o Zustand para gerar e armazenar os times
    const handleGenerateTeams = () => {
        generateTeams(selectedPlayers, teamSize);
    };

    // Mutação para salvar jogo no Firestore
    const mutation = useMutation({
        mutationFn: async (game: Game) => {
            return await gameService.createGame(game);
        },
        onSuccess: (docRef) => {
            toast.success("Jogo salvo com sucesso! ✅");
            navigate(`/games/${docRef.id}`);
        },
        onError: () => toast.error("Erro ao salvar o jogo ❌"),
    });

    const handleSaveGame = () => {
        if (!teams) return;

        const gameData: Game = {
            date: new Date().toISOString(),
            teams,
            players: selectedPlayers,
            gameFee: 10,
            payments: selectedPlayers.map((player) => ({
                playerId: player.id!,
                amountPaid: 0,
                hasPaid: false,
            })),
        };

        mutation.mutate(gameData);
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 bg-white">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
                    Gerador de Times
                </h2>
                <div className="mb-2 text-center font-semibold text-gray-700">
                    Jogadores Selecionados:{" "}
                    <span className="text-primary">
                        {selectedPlayers.length}
                    </span>{" "}
                    / {players?.length}
                </div>

                <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
                    <Input
                        type="text"
                        placeholder="Pesquisar jogadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <Label className="flex cursor-pointer items-center gap-2">
                        <Input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={handleSelectAll}
                            className="h-5 w-5"
                        />
                        <span className="text-sm">Selecionar todos</span>
                    </Label>
                </div>

                <div className="mb-4">
                    <h3 className="mb-2 text-lg font-bold text-gray-700">
                        Selecione os jogadores que participarão:
                    </h3>
                    <div className="grid max-h-64 grid-cols-1 gap-3 overflow-auto rounded-lg border bg-gray-100 p-4 md:grid-cols-2">
                        {filteredPlayers.map((player) => (
                            <label
                                key={player.id}
                                className="flex cursor-pointer items-center gap-3 rounded-md border bg-white p-2 shadow-sm hover:bg-gray-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPlayers.some(
                                        (p) => p.id === player.id,
                                    )}
                                    onChange={() => handleSelectPlayer(player)}
                                    className="h-5 w-5"
                                />
                                <span className="font-semibold">
                                    {player.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    (Overall: {calculateOverall(player)})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4 md:flex-row">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Jogadores por Time:
                        </label>
                        <input
                            type="number"
                            value={teamSize}
                            onChange={(e) =>
                                setTeamSize(Number(e.target.value))
                            }
                            min="2"
                            className="w-full rounded-md border p-2"
                            placeholder="Ex: 4"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            onClick={handleGenerateTeams}
                            className="w-full"
                        >
                            Gerar Times
                        </Button>
                    </div>
                </div>

                {teams && (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {teams.map((team, index) => (
                                <TeamCard
                                    key={index}
                                    team={team}
                                    index={index}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleSaveGame}
                            className="mt-6 w-full rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Salvando..." : "Salvar Jogo"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
