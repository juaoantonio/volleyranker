import { calculateOverall, calculateTeamStatsForRadar } from "../utils.ts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/Chart.tsx";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from "recharts";
import { Team } from "../types/team.ts";
import { Player } from "../types/player.ts";
import { ArrowLeftRight } from "lucide-react";
import { useTeamStore } from "../store/useTeamStore.ts";
import { useState } from "react";

export const TeamCard = ({ team, index }: { team: Team; index: number }) => {
    const teamStats = calculateTeamStatsForRadar(team);
    const advancedScore = teamStats.overall;

    const teamRadarData = [
        { attribute: "Atq", value: teamStats.attack },
        { attribute: "Saq", value: teamStats.serve },
        { attribute: "Levant", value: teamStats.set },
        { attribute: "Def", value: teamStats.defense },
        { attribute: "Pos", value: teamStats.positioning },
        { attribute: "Recep", value: teamStats.reception },
        { attribute: "Const", value: teamStats.consistency },
        { attribute: "Bloq", value: teamStats.block },
    ];

    const chartConfig: ChartConfig = {
        value: {
            label: "Valor",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <h3 className="text-xl font-bold text-blue-600 mb-2 sm:mb-0">
                    Time {index + 1}
                </h3>
                <div className="text-lg font-semibold">
                    Overall do Time:{" "}
                    <span className="text-green-600">{advancedScore}</span>
                </div>
            </div>

            {/* Radar Chart para os dados agregados do time */}
            <ChartContainer
                config={chartConfig}
                className="mx-auto w-full max-w-[450px] aspect-square"
            >
                <RadarChart data={teamRadarData}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis
                        dataKey="attribute"
                        tick={{ fontSize: 10, dy: 6 }}
                    />
                    <PolarGrid />
                    <PolarRadiusAxis
                        domain={[0, 5]}
                        tickCount={6}
                        allowDataOverflow={false}
                    />
                    <Radar
                        dataKey="value"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.6}
                        dot={{ r: 4, fillOpacity: 1 }}
                    />
                </RadarChart>
            </ChartContainer>

            {/* Exibe as estatísticas agregadas */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-sm font-medium">
                <div>
                    <p className="text-gray-700">
                        Ataque: {teamStats.attack.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Saque: {teamStats.serve.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Levantamento: {teamStats.set.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Defesa: {teamStats.defense.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-gray-700">
                        Posicionamento: {teamStats.positioning.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Recepção: {teamStats.reception.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Consistência: {teamStats.consistency.toFixed(2)}
                    </p>
                    <p className="text-gray-700">
                        Bloqueio: {teamStats.block.toFixed(2)}
                    </p>
                </div>
            </div>

            <PlayerListInTeam players={team.players} teamIndex={index} />
        </div>
    );
};

export const PlayerListInTeam = ({
    players,
    teamIndex,
}: {
    players: Player[];
    teamIndex: number;
}) => {
    const { teams, swapPlayers } = useTeamStore();
    const [openDropdown, setOpenDropdown] = useState<string | null | undefined>(
        null,
    );

    const handleSwap = (playerOut: Player, playerIn: Player) => {
        swapPlayers(playerOut, playerIn);
        setOpenDropdown(null);
    };

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Jogadores:
            </h4>
            <ul className="space-y-2">
                {players.map((player) => (
                    <li
                        key={player.id}
                        className="flex items-center gap-3 border-b pb-2 relative"
                    >
                        {/* Avatar */}
                        {player.imageUrl ? (
                            <img
                                src={player.imageUrl}
                                alt={player.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">🏐</span>
                            </div>
                        )}

                        {/* Nome e overall */}
                        <div className="flex flex-col">
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-gray-500 text-sm">
                                Overall: {calculateOverall(player)}
                            </span>
                        </div>

                        {/* Ícone de troca */}
                        <div className="ml-auto relative">
                            <button
                                onClick={() =>
                                    setOpenDropdown(
                                        openDropdown === player.id
                                            ? null
                                            : player.id,
                                    )
                                }
                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                title="Trocar jogador"
                            >
                                <ArrowLeftRight className="text-gray-600 w-5 h-5" />
                            </button>

                            {/* Dropdown de troca */}
                            {openDropdown === player.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-10">
                                    <ul className="max-h-48 overflow-y-auto">
                                        {teams
                                            ?.flatMap(
                                                (team, idx) =>
                                                    idx !== teamIndex
                                                        ? team.players
                                                        : [], // Só inclui jogadores de outros times
                                            )
                                            .map((swapCandidate) => (
                                                <li key={swapCandidate.id}>
                                                    <button
                                                        onClick={() =>
                                                            handleSwap(
                                                                player,
                                                                swapCandidate,
                                                            )
                                                        }
                                                        className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        {swapCandidate.imageUrl ? (
                                                            <img
                                                                src={
                                                                    swapCandidate.imageUrl
                                                                }
                                                                alt={
                                                                    swapCandidate.name
                                                                }
                                                                className="w-6 h-6 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500">
                                                                    🏐
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="text-sm">
                                                            {swapCandidate.name}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
