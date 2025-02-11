import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { generateTeams } from "../services/generateTeams.ts";
import { Player } from "../types/player.ts";
import { calculateOverall, calculateTeamStatsForRadar } from "../utils.ts";
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

export const TeamGenerator = () => {
  const { players } = usePlayers();
  const [teams, setTeams] = useState<Player[][] | null>(null);
  const [teamSize, setTeamSize] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = (players ?? []).filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const allFilteredSelected =
    filteredPlayers.length > 0 &&
    filteredPlayers.every((player) =>
      selectedPlayers.some((p) => p.id === player.id),
    );

  // Alterna seleção de um único jogador
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player],
    );
  };

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedPlayers((prev) =>
        prev.filter(
          (player) =>
            !filteredPlayers.some(
              (filteredPlayer) => filteredPlayer.id === player.id,
            ),
        ),
      );
    } else {
      setSelectedPlayers((prev) => {
        const union = [...prev];
        filteredPlayers.forEach((player) => {
          if (!prev.some((p) => p.id === player.id)) {
            union.push(player);
          }
        });
        return union;
      });
    }
  };

  // Gera os times apenas com os jogadores selecionados
  const handleGenerateTeams = () => {
    if (selectedPlayers.length < teamSize) {
      setError("Selecione jogadores suficientes para formar os times.");
      setTeams(null);
      return;
    }

    const result = generateTeams(
      selectedPlayers,
      teamSize,
      selectedPlayers.length,
    );
    if ("error" in result) {
      setError(result.error);
      setTeams(null);
    } else {
      setError(null);
      setTeams(result);
    }
  };

  // Componente interno para exibir cada time
  const TeamCard = ({ team, index }: { team: Player[]; index: number }) => {
    // Usa a função externa para calcular as estatísticas do time
    const teamStats = calculateTeamStatsForRadar(team);
    // Utiliza a propriedade "overall" como overall avançado
    const advancedScore = teamStats.overall;

    // Define os dados para o RadarChart com base no objeto retornado
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

    // Configuração do gráfico (baseada na configuração do PlayerDetail)
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
            <p className="text-gray-700">Saque: {teamStats.serve.toFixed(2)}</p>
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

        {/* Lista dos jogadores do time */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Jogadores:
          </h4>
          <ul className="space-y-2">
            {team.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 border-b pb-2"
              >
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
                <span className="font-semibold">{player.name}</span>
                <span className="text-gray-500 text-sm">
                  Overall: {calculateOverall(player)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Painel de seleção e configuração */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ⚡ Gerador de Times
        </h2>
        <div className="text-center font-semibold text-gray-700 mb-2">
          Jogadores Selecionados:{" "}
          <span className="text-blue-600">{selectedPlayers.length}</span> /{" "}
          {players?.length}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Pesquisar jogadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={handleSelectAll}
              className="w-5 h-5"
            />
            <span className="text-sm">Selecionar todos</span>
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Selecione os jogadores que participarão:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded-lg bg-gray-100 max-h-64 overflow-auto">
            {filteredPlayers.map((player) => (
              <label
                key={player.id}
                className="flex items-center gap-3 bg-white p-2 rounded-md border shadow-sm cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedPlayers.some((p) => p.id === player.id)}
                  onChange={() => handleSelectPlayer(player)}
                  className="w-5 h-5"
                />
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">🏐</span>
                  </div>
                )}
                <span className="font-semibold">{player.name}</span>
                <span className="text-gray-500 text-sm">
                  (Overall: {calculateOverall(player)})
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Jogadores por Time:
            </label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              min="2"
              className="border p-2 rounded-md w-full"
              placeholder="Ex: 4"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateTeams}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Gerar Times
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {/* Exibição dos times gerados */}
      {teams && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team, index) => (
            <TeamCard key={index} team={team} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
