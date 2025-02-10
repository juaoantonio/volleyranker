import { Player } from "../types/player.ts";

export const generateTeams = (
  players: Player[],
  teamSize: number,
  totalPlayers: number,
) => {
  if (players.length < totalPlayers) {
    return {
      error: `O grupo tem apenas ${players.length} jogadores cadastrados!`,
    };
  }

  // Ordena jogadores por overall (do maior para o menor)
  const sortedPlayers = [...players].sort((a, b) => b.overall - a.overall);

  // Separa jogadores que têm um bom levantamento (set >= 4)
  const setters = sortedPlayers.filter((p) => p.set >= 4);
  const others = sortedPlayers.filter((p) => p.set < 4);

  const numTeams = Math.floor(totalPlayers / teamSize);
  const teams: Player[][] = Array.from({ length: numTeams }, () => []);

  // ✅ Passo 1: Adiciona pelo menos um levantador por time
  for (let i = 0; i < numTeams; i++) {
    if (setters.length > 0) {
      teams[i].push(setters.shift()!);
    }
  }

  // ✅ Passo 2: Distribui os outros jogadores de forma balanceada
  const remainingPlayers = [...setters, ...others];

  while (remainingPlayers.length > 0) {
    for (let i = 0; i < numTeams; i++) {
      if (teams[i].length < teamSize && remainingPlayers.length > 0) {
        teams[i].push(remainingPlayers.shift()!);
      }
    }
  }

  return teams;
};
