import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Player } from "./types/player.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateOverall(player: Player) {
  return Number(
    (
      player.attack * 0.2 +
      player.serve * 0.15 +
      player.set * 0.15 +
      player.defense * 0.15 +
      player.block * 0.125 +
      player.positioning * 0.1 +
      player.reception * 0.1 +
      player.consistency * 0.1
    ).toFixed(2),
  );
}
