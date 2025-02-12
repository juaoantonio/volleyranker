import { Player } from "./player.ts";

export interface Team {
    id?: string;
    players: Player[];
}
