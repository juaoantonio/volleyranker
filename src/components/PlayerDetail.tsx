import { Link, useParams } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";
import { ArrowLeft } from "lucide-react";
import {
  assignPosition,
  calculateOverall,
  cn,
  positionColors,
} from "../utils.ts";
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
} from "./ui/Chart.tsx";

export const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { players } = usePlayers();

  const player = players?.find((p) => p.id === id);

  if (!player) {
    return <p className="text-center text-red-500">Jogador não encontrado.</p>;
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
  const chartConfig = {
    value: {
      label: "Valor",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <Link to="/admin" className="text-blue-500 flex items-center gap-2 mb-4">
        <ArrowLeft size={18} /> Voltar para o Ranking
      </Link>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {player.name} - Overall:{" "}
        <span className="text-blue-600">{calculateOverall(player)}</span>
      </h2>

      <div className={"w-full"}>
        <span
          className={cn(
            "text-center mx-auto py-1 px-3 rounded-full mb-4 block w-min",
            positionColors[playerPosition].bg,
            positionColors[playerPosition].text,
          )}
        >
          {playerPosition}
        </span>
      </div>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[450px]"
      >
        <RadarChart data={playerStats}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fontSize: 12, dy: 5 }} // Ajusta posição das labels
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

      <div className="grid grid-cols-2 md:grid-cols-3 text-sm gap-2 text-gray-700">
        <p>
          <strong>Ataque:</strong> {player.attack}
        </p>
        <p>
          <strong>Eficiência no Saque:</strong> {player.serve}
        </p>
        <p>
          <strong>Levantamento:</strong> {player.set}
        </p>
        <p>
          <strong>Defesa:</strong> {player.defense}
        </p>
        <p>
          <strong>Posicionamento:</strong> {player.positioning}
        </p>
        <p>
          <strong>Recepção:</strong> {player.reception}
        </p>
        <p>
          <strong>Constância:</strong> {player.consistency}
        </p>
        <p>
          <strong>Bloqueio</strong> {player.block}
        </p>
      </div>
    </div>
  );
};
