import { Player } from "../types/player.ts";

export const generateTeams = (
  players: Player[],
  teamSize: number,
  totalPlayers: number,
) => {
  // Verifica se há jogadores suficientes
  if (players.length < totalPlayers) {
    return {
      error: `O grupo tem apenas ${players.length} jogadores cadastrados!`,
    };
  }

  // Calcula o número de times a serem formados
  const numTeams = Math.floor(totalPlayers / teamSize);

  // Cria uma estrutura para armazenar cada time e sua soma de overall
  const teams: { players: Player[]; totalOverall: number }[] = Array.from(
    { length: numTeams },
    () => ({ players: [], totalOverall: 0 }),
  );

  // Função auxiliar para gerar um ruído aleatório (entre -0.5 e +0.5)
  const randomNoise = () => (Math.random() - 0.5) * 1.0;

  // Separa os jogadores bons no levantamento (set >= 4) dos demais
  let setters = players.filter((p) => p.set >= 4);
  const others = players.filter((p) => p.set < 4);

  // Embaralha (ordenando com ruído) os setters para variar a ordem a cada execução
  setters = setters.sort(
    (a, b) => b.overall + randomNoise() - (a.overall + randomNoise()),
  );

  // Passo 1: Pré-atribui um setter para cada time (se disponível)
  for (let i = 0; i < numTeams; i++) {
    if (setters.length > 0) {
      const setter = setters.shift()!;
      teams[i].players.push(setter);
      teams[i].totalOverall += setter.overall;
    }
  }

  // Junta os jogadores restantes (setters não usados e os demais)
  let remainingPlayers = [...setters, ...others];
  // Ordena os jogadores restantes usando o overall com ruído para variar a ordem
  remainingPlayers = remainingPlayers.sort(
    (a, b) => b.overall + randomNoise() - (a.overall + randomNoise()),
  );

  // Passo 2: Distribui os jogadores restantes para balancear os totais de overall
  // Atribui cada jogador à equipe que (ainda não completa) tem o menor total overall
  while (remainingPlayers.length > 0) {
    // Seleciona os times que ainda não estão completos
    const eligibleTeams = teams.filter(
      (team) => team.players.length < teamSize,
    );
    if (eligibleTeams.length === 0) break;

    const player = remainingPlayers.shift()!;

    // Encontra o time elegível com o menor totalOverall
    let minTeamIndex = -1;
    let minTotal = Infinity;
    for (let i = 0; i < teams.length; i++) {
      if (
        teams[i].players.length < teamSize &&
        teams[i].totalOverall < minTotal
      ) {
        minTotal = teams[i].totalOverall;
        minTeamIndex = i;
      }
    }
    if (minTeamIndex >= 0) {
      teams[minTeamIndex].players.push(player);
      teams[minTeamIndex].totalOverall += player.overall;
    }
  }

  // Retorna apenas a lista de jogadores de cada time (omitindo a soma de overall)
  return teams.map((team) => team.players);
};
