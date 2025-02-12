import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "./types/player.ts";
import { Team } from "./types/team.ts";

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

export enum Position {
    Setter = "Levantador",
    Middle = "Central",
    Opposite = "Oposto",
    Wing = "Ponta",
    Libero = "Líbero",
}

export const positionColors: Record<Position, Record<"bg" | "text", string>> = {
    [Position.Setter]: {
        text: "text-blue-600",
        bg: "bg-blue-100",
    },
    [Position.Middle]: {
        text: "text-green-600",
        bg: "bg-green-100",
    },
    [Position.Opposite]: {
        text: "text-red-600",
        bg: "bg-red-100",
    },
    [Position.Wing]: {
        text: "text-yellow-600",
        bg: "bg-yellow-100",
    },
    [Position.Libero]: {
        text: "text-gray-600",
        bg: "bg-gray-100",
    },
};

/**
 * Atribui uma posição ao jogador com base em um cálculo avançado dos seus atributos.
 *
 * As posições consideradas são:
 * - **Levantador:** Prioriza o "set", mas também valoriza o serviço, a consistência e a recepção.
 * - **Central:** Foca no bloqueio, defesa e posicionamento.
 * - **Oposto:** Destaque para ataque, serviço e consistência, com um pouco de defesa.
 * - **Ponta:** Jogador versátil que combina ataque e recepção, com suporte do serviço e consistência.
 * - **Líbero:** Especialista em recepção, com boa defesa, posicionamento e consistência.
 */
export function assignPosition(player: Player): Position {
    const setterScore =
        player.set * 0.5 +
        player.serve * 0.15 +
        player.consistency * 0.2 +
        player.reception * 0.15;
    const centralScore =
        player.block * 0.5 + player.defense * 0.3 + player.positioning * 0.2;
    const oppositeScore =
        player.attack * 0.5 +
        player.serve * 0.2 +
        player.consistency * 0.2 +
        player.defense * 0.1;
    const wingScore =
        player.attack * 0.4 +
        player.reception * 0.4 +
        player.serve * 0.1 +
        player.consistency * 0.1;
    const liberoScore =
        player.reception * 0.4 +
        player.defense * 0.3 +
        player.positioning * 0.2 +
        player.consistency * 0.1;

    const positions = [
        { name: Position.Setter, score: setterScore },
        { name: Position.Middle, score: centralScore },
        { name: Position.Opposite, score: oppositeScore },
        { name: Position.Wing, score: wingScore },
        { name: Position.Libero, score: liberoScore },
    ];

    // Seleciona a posição com o maior score
    const bestPosition = positions.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev,
    );

    return bestPosition.name;
}

/**
 * Calcula um overall avançado para um time de jogadores.
 *
 * O cálculo é feito em duas etapas:
 * 1. Calcula as estatísticas agregadas do time (média de cada atributo).
 * 2. Aplica um cálculo avançado que inclui:
 *    - Uma nota base ponderada usando os mesmos pesos dos jogadores individuais.
 *    - Um bônus de equilíbrio que valoriza times cujos jogadores apresentam atributos mais homogêneos.
 *
 * A nota final é limitada a um máximo de 5.
 *
 * @param team - Array de jogadores que compõem o time.
 * @returns O overall avançado do time, com duas casas decimais.
 */
export interface TeamStats {
    attack: number;
    serve: number;
    set: number;
    defense: number;
    block: number;
    positioning: number;
    reception: number;
    consistency: number;
    overall: number;
}

export function calculateTeamStatsForRadar(team: Team): TeamStats {
    if (team.players.length === 0) {
        return {
            attack: 0,
            serve: 0,
            set: 0,
            defense: 0,
            block: 0,
            positioning: 0,
            reception: 0,
            consistency: 0,
            overall: 0,
        };
    }

    // 1. Cálculo das estatísticas agregadas (média de cada atributo)
    const aggregatedStats = {
        attack:
            team.players.reduce((sum, p) => sum + p.attack, 0) /
            team.players.length,
        serve:
            team.players.reduce((sum, p) => sum + p.serve, 0) /
            team.players.length,
        set:
            team.players.reduce((sum, p) => sum + p.set, 0) /
            team.players.length,
        defense:
            team.players.reduce((sum, p) => sum + p.defense, 0) /
            team.players.length,
        block:
            team.players.reduce((sum, p) => sum + p.block, 0) /
            team.players.length,
        positioning:
            team.players.reduce((sum, p) => sum + p.positioning, 0) /
            team.players.length,
        reception:
            team.players.reduce((sum, p) => sum + p.reception, 0) /
            team.players.length,
        consistency:
            team.players.reduce((sum, p) => sum + p.consistency, 0) /
            team.players.length,
    };

    // 2. Cálculo da nota base usando pesos definidos (os mesmos utilizados para jogadores)
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

    const baseScore =
        aggregatedStats.attack * weights.attack +
        aggregatedStats.serve * weights.serve +
        aggregatedStats.set * weights.set +
        aggregatedStats.defense * weights.defense +
        aggregatedStats.block * weights.block +
        aggregatedStats.positioning * weights.positioning +
        aggregatedStats.reception * weights.reception +
        aggregatedStats.consistency * weights.consistency;

    // 3. Cálculo do bônus de equilíbrio:
    // Para cada atributo, calcula o desvio padrão entre os jogadores do time.
    // Quanto menor o desvio, mais equilibrado o time (e maior o bônus).
    const attributes = [
        "attack",
        "serve",
        "set",
        "defense",
        "block",
        "positioning",
        "reception",
        "consistency",
    ] as const;

    const stdevs = attributes.map((attr) => {
        const mean = aggregatedStats[attr];
        const variance =
            team.players.reduce(
                (acc, p) => acc + Math.pow(p[attr] - mean, 2),
                0,
            ) / team.players.length;
        return Math.sqrt(variance);
    });

    // Média dos desvios padrões entre todos os atributos
    const avgStdev =
        stdevs.reduce((sum, stdev) => sum + stdev, 0) / stdevs.length;

    // Valor máximo teórico de desvio padrão (ajustado para a escala de 0 a 5)
    const maxPossibleStdev = 2.5;
    // O bônus de equilíbrio varia de 0 (time muito desequilibrado) até 0.2 (time extremamente equilibrado)
    const balanceBonus = (1 - Math.min(1, avgStdev / maxPossibleStdev)) * 0.2;

    // 4. Nota avançada do time: soma da nota base e o bônus, limitada a 5
    let overallScore = baseScore + balanceBonus;
    overallScore = Math.min(5, overallScore);

    return {
        attack: Number(aggregatedStats.attack.toFixed(2)),
        serve: Number(aggregatedStats.serve.toFixed(2)),
        set: Number(aggregatedStats.set.toFixed(2)),
        defense: Number(aggregatedStats.defense.toFixed(2)),
        block: Number(aggregatedStats.block.toFixed(2)),
        positioning: Number(aggregatedStats.positioning.toFixed(2)),
        reception: Number(aggregatedStats.reception.toFixed(2)),
        consistency: Number(aggregatedStats.consistency.toFixed(2)),
        overall: Number(overallScore.toFixed(2)),
    };
}
