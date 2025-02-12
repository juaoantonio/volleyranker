import { useMutation, useQuery } from "@tanstack/react-query";
import {
    addPlayer,
    getPlayers,
    removePlayer,
    updatePlayer,
} from "../services/firebase";
import { Player } from "../types/player";
import { toast } from "react-toastify";
import { queryClient } from "../main.tsx";

export const usePlayers = () => {
    // ✅ Buscar jogadores (GET)
    const {
        data: players,
        isLoading,
        isError,
    } = useQuery<Player[]>({
        queryKey: ["players"],
        queryFn: getPlayers,
    });

    // ✅ Adicionar jogador (POST)
    const addMutation = useMutation({
        mutationFn: async (newPlayer: Player) => addPlayer(newPlayer),
        onSuccess: async (_, newPlayer) => {
            queryClient.setQueryData(
                ["players"],
                (oldPlayers: Player[] | undefined) => [
                    ...(oldPlayers || []),
                    newPlayer,
                ],
            );
            await queryClient.invalidateQueries({ queryKey: ["players"] });
            toast("Jogador adicionado com sucesso!", {
                type: "success",
            });
        },

        onError: async () => {
            toast("Erro ao adicionar jogador!", {
                type: "error",
            });
        },
    });

    // ✅ Atualizar jogador (PATCH)
    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            updatedPlayer,
        }: {
            id: string;
            updatedPlayer: Partial<Player>;
        }) => updatePlayer(id, updatedPlayer),
        onSuccess: async (_, { id, updatedPlayer }) => {
            queryClient.setQueryData(
                ["players"],
                (oldPlayers: Player[] | undefined) =>
                    oldPlayers?.map((player) =>
                        player.id === id
                            ? { ...player, ...updatedPlayer }
                            : player,
                    ) || [],
            );
            await queryClient.invalidateQueries({ queryKey: ["players"] });
            toast("Jogador atualizado com sucesso!", {
                type: "success",
            });
        },
        onError: async () => {
            toast("Erro ao atualizar jogador!", {
                type: "error",
            });
        },
    });

    // ✅ Remover jogador (DELETE)
    const removeMutation = useMutation({
        mutationFn: async (id: string) => removePlayer(id),
        onSuccess: async (_, id) => {
            queryClient.setQueryData(
                ["players"],
                (oldPlayers: Player[] | undefined) =>
                    oldPlayers?.filter((player) => player.id !== id) || [],
            );
            await queryClient.invalidateQueries({ queryKey: ["players"] });
            toast("Jogador removido com sucesso!", {
                type: "success",
            });
        },
        onError: async () => {
            toast("Erro ao remover jogador!", {
                type: "error",
            });
        },
    });

    return {
        players,
        isLoading,
        isError,
        addMutation,
        updateMutation,
        removeMutation,
    };
};
