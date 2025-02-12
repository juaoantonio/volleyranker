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
      console.log(game);
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ⚡ Gerador de Times
        </h2>
        <div className="text-center font-semibold text-gray-700 mb-2">
          Jogadores Selecionados:{" "}
          <span className="text-blue-600">{selectedPlayers.length}</span> /{" "}
          {players?.length}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Pesquisar jogadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={handleSelectAll}
              className="w-5 h-5"
            />
            <span className="text-sm">Selecionar todos</span>
          </label>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Selecione os jogadores que participarão:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded-lg bg-gray-100 max-h-64 overflow-auto">
            {filteredPlayers.map((player) => (
              <label
                key={player.id}
                className="flex items-center gap-3 bg-white p-2 rounded-md border shadow-sm cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedPlayers.some((p) => p.id === player.id)}
                  onChange={() => handleSelectPlayer(player)}
                  className="w-5 h-5"
                />
                <span className="font-semibold">{player.name}</span>
                <span className="text-gray-500 text-sm">
                  (Overall: {calculateOverall(player)})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Jogadores por Time:
            </label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              min="2"
              className="border p-2 rounded-md w-full"
              placeholder="Ex: 4"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateTeams}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Gerar Times
            </button>
          </div>
        </div>

        {teams && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <TeamCard key={index} team={team} index={index} />
              ))}
            </div>

            <button
              onClick={handleSaveGame}
              className="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
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
