import { Player } from "./player.ts";
import { Team } from "./team.ts";
import { Payment } from "./payment.ts";

export interface Game {
    id?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    teams?: Team[];
    players?: Player[];
    gameFee?: number;
    payments?: Payment[];
}

export interface Evaluation {
    id?: string;
    gameId: string;
    evaluatorId: string; // jogador que está avaliando
    evaluatedId: string; // jogador avaliado
    ratings: {
        attack: number;
        serve: number;
        set: number;
        defense: number;
        positioning: number;
        reception: number;
        consistency: number;
        block: number;
    };
    createdAt: string;
}

export interface Adjustments {
    attack: number;
    serve: number;
    set: number;
    defense: number;
    positioning: number;
    reception: number;
    consistency: number;
    block: number;
}
