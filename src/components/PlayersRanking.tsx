import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { Search, Trophy } from "lucide-react";
import { calculateOverall } from "../utils";
import { Loading } from "./loading";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card.tsx";
import { PlayerCard } from "./player-card.tsx";

export function PlayersRanking() {
    const { players, isLoading } = usePlayers();
    const [query, setQuery] = useState("");

    if (isLoading) return <Loading />;

    if (!players?.length) {
        return (
            <Card className="mx-auto max-w-3xl shadow-lg">
                <CardContent className="p-6 text-center">
                    <p className="text-gray-600">Nenhum jogador cadastrado.</p>
                </CardContent>
            </Card>
        );
    }

    const normalizeText = (text: string) =>
        text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const filteredPlayers = players
        .sort((a, b) => calculateOverall(b) - calculateOverall(a))
        .filter((player) =>
            normalizeText(player.name).includes(normalizeText(query)),
        );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 text-center text-xl font-bold text-gray-800 md:text-3xl">
                <Trophy size={20} className={"text-primary"} /> Ranking de
                Jogadores
            </div>
            <div>
                <div className="mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pesquisar jogador..."
                            className="pl-10"
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                            <Search size={20} className="text-gray-500" />
                        </div>
                        {query && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQuery("")}
                                className="absolute inset-y-0 right-2"
                            >
                                ✕
                            </Button>
                        )}
                    </div>
                </div>

                {filteredPlayers.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Nenhum jogador encontrado.
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {filteredPlayers.map((player, index) => (
                            <li key={player.id}>
                                <PlayerCard player={player} index={index} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
