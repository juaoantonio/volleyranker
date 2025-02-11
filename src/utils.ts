import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "./types/player.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateOverall(player: Player): number {
  // A soma dos pesos é 1.0, o que garante que, se todos os atributos forem 5, a nota base será 5.
  const weights = {
    attack: 0.18,
    serve: 0.12,
    set: 0.12,
    defense: 0.17,
    block: 0.13,
    positioning: 0.1,
    reception: 0.1,
    consistency: 0.08,
  };

  // Cálculo da soma ponderada dos atributos (nota base)
  const baseScore =
    player.attack * weights.attack +
    player.serve * weights.serve +
    player.set * weights.set +
    player.defense * weights.defense +
    player.block * weights.block +
    player.positioning * weights.positioning +
    player.reception * weights.reception +
    player.consistency * weights.consistency;

  // Cálculo de um bônus que valoriza jogadores com desempenho equilibrado
  const skills = [
    player.attack,
    player.serve,
    player.set,
    player.defense,
    player.block,
    player.positioning,
    player.reception,
    player.consistency,
  ];
  const meanSkill = skills.reduce((sum, val) => sum + val, 0) / skills.length;
  const variance =
    skills.reduce((sum, val) => sum + Math.pow(val - meanSkill, 2), 0) /
    skills.length;
  const stdev = Math.sqrt(variance);

  // Para 8 atributos com valores entre 0 e 5, o desvio máximo teórico (em um cenário extremo) é aproximadamente 1.65.
  // Quanto menor o desvio, maior o equilíbrio do jogador.
  const maxPossibleStdev = 1.65;
  // Bônus de equilíbrio: se o jogador for muito equilibrado (stdev baixo), recebe um bônus de até 0.2 pontos.
  const balanceBonus = (1 - Math.min(1, stdev / maxPossibleStdev)) * 0.2;

  // Nota avançada combinando a nota base e o bônus de equilíbrio
  const advancedScore = baseScore + balanceBonus;

  // Garante que o overall não ultrapasse 5
  const overall = Math.min(5, advancedScore);

  return Number(overall.toFixed(2));
}
