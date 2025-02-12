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
