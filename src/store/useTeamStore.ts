import { create } from "zustand";
import { Team } from "../types/team";
import { generateTeams } from "../services/generateTeams";
import { Player } from "../types/player";

interface TeamState {
  teams: Team[] | null;
  generateTeams: (selectedPlayers: Player[], teamSize: number) => void;
  swapPlayers: (playerOut: Player, playerIn: Player) => void;
  resetTeams: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: null,

  generateTeams: (selectedPlayers, teamSize) => {
    if (selectedPlayers.length < teamSize) {
      set({ teams: null });
      return;
    }

    const result = generateTeams(
      selectedPlayers,
      teamSize,
      selectedPlayers.length,
    );

    if ("error" in result) {
      console.error(result.error);
      set({ teams: null });
    } else {
      set({ teams: result });
    }
  },

  swapPlayers: (playerOut, playerIn) => {
    set((state) => {
      if (!state.teams) return {};

      // Cria uma cópia dos times para evitar mutação direta no estado
      const updatedTeams = state.teams.map((team) => ({
        ...team,
        players: [...team.players],
      }));

      let teamOutIndex = -1;
      let teamInIndex = -1;

      // Encontra os times dos jogadores envolvidos
      updatedTeams.forEach((team, index) => {
        if (team.players.some((p) => p.id === playerOut.id))
          teamOutIndex = index;
        if (team.players.some((p) => p.id === playerIn.id)) teamInIndex = index;
      });

      if (
        teamOutIndex !== -1 &&
        teamInIndex !== -1 &&
        teamOutIndex !== teamInIndex
      ) {
        // Remove os jogadores de seus times
        updatedTeams[teamOutIndex].players = updatedTeams[
          teamOutIndex
        ].players.filter((p) => p.id !== playerOut.id);
        updatedTeams[teamInIndex].players = updatedTeams[
          teamInIndex
        ].players.filter((p) => p.id !== playerIn.id);

        // Adiciona os jogadores trocados
        updatedTeams[teamOutIndex].players.push(playerIn);
        updatedTeams[teamInIndex].players.push(playerOut);

        return { teams: updatedTeams };
      }

      return {};
    });
  },

  resetTeams: () => set({ teams: null }),
}));
