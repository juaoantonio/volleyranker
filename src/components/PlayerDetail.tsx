import { useNavigate, useParams } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";
import {
    ArrowLeft,
    Ban,
    CircleArrowOutDownLeft,
    MapPin,
    Repeat,
    Send,
    Shield,
    Split,
    Zap,
} from "lucide-react";
import { assignPosition, calculateOverall, cn, positionColors } from "../utils";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import { CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ReactElement } from "react";
import { Player } from "../types/player";

const iconMapping: { [key: string]: ReactElement } = {
    attack: <Zap className="h-6 w-6 text-blue-500" />,
    serve: <Send className="h-6 w-6 text-green-500" />,
    set: <Split className="h-6 w-6 text-indigo-500" />,
    defense: <Shield className="h-6 w-6 text-red-500" />,
    positioning: <MapPin className="h-6 w-6 text-yellow-500" />,
    reception: <CircleArrowOutDownLeft className="h-6 w-6 text-purple-500" />,
    consistency: <Repeat className="h-6 w-6 text-teal-500" />,
    block: <Ban className="h-6 w-6 text-orange-500" />,
};

const statLabels: { [key: string]: string } = {
    attack: "Ataque",
    serve: "Eficiência no Saque",
    set: "Levantamento",
    defense: "Defesa",
    positioning: "Posicionamento",
    reception: "Recepção",
    consistency: "Constância",
    block: "Bloqueio",
};

export const PlayerDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { players } = usePlayers();

    const player = players?.find((p) => p.id === id);

    if (!player) {
        return (
            <p className="text-center text-red-500">Jogador não encontrado.</p>
        );
    }

    const playerStats = [
        { attribute: "Atq", value: player.attack },
        { attribute: "Saq", value: player.serve },
        { attribute: "Levant", value: player.set },
        { attribute: "Def", value: player.defense },
        { attribute: "Pos", value: player.positioning },
        { attribute: "Recep", value: player.reception },
        { attribute: "Const", value: player.consistency },
        { attribute: "Bloq", value: player.block },
    ];

    const playerPosition = assignPosition(player);

    // Configuração do gráfico utilizando as CSS variables do globals.css
    const chartConfig: ChartConfig = {
        value: {
            label: "Valor",
            color: "var(--color-chart-1)",
        },
    };

    return (
        <div>
            <Button
                variant="ghost"
                className="text-primary flex items-center gap-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={18} /> Voltar
            </Button>
            <div className="p-6">
                <CardTitle className="text-foreground mb-4 text-center text-2xl font-bold">
                    {player.name} - Overall:{" "}
                    <span className="text-primary">
                        {calculateOverall(player)}
                    </span>
                </CardTitle>

                <div className="w-full">
                    <Badge
                        className={cn(
                            "mx-auto mb-4 block w-min rounded-full px-3 py-1 text-center",
                            positionColors[playerPosition].bg,
                            positionColors[playerPosition].text,
                        )}
                    >
                        {playerPosition}
                    </Badge>
                </div>

                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[450px]"
                >
                    <RadarChart data={playerStats}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <PolarAngleAxis
                            dataKey="attribute"
                            tick={{ fontSize: 12, dy: 5 }}
                        />
                        <PolarGrid />
                        <PolarRadiusAxis
                            domain={[0, 5]}
                            tickCount={6}
                            allowDataOverflow={false}
                        />
                        <Radar
                            dataKey="value"
                            stroke="var(--color-value)"
                            fill="var(--color-value)"
                            fillOpacity={0.6}
                            dot={{ r: 4, fillOpacity: 1 }}
                        />
                    </RadarChart>
                </ChartContainer>

                <div className="text-foreground mt-4 grid grid-cols-2 gap-4 text-center md:grid-cols-3">
                    {Object.entries(statLabels).map(([statKey, label]) => (
                        <div
                            key={statKey}
                            className="bg-background flex flex-col items-center justify-center rounded p-4 shadow-md"
                        >
                            {iconMapping[statKey as keyof Player]}
                            <p className="mt-2 font-semibold">{label}</p>
                            <p className="mt-1 text-xl">
                                {player[statKey as keyof Player]}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
