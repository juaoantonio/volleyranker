import { Link, useNavigate } from "react-router-dom";
import { Crown, Edit2, Eye, Trash, User } from "lucide-react";
import { assignPosition, calculateOverall, cn, positionColors } from "../utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Player } from "../types/player.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface PlayerCardProps {
    player: Player;
    index: number;
}

export function PlayerCard({ player, index }: PlayerCardProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <Card
            onClick={() => navigate(`/admin/player/${player.id}`)}
            className="border-primary flex w-full cursor-pointer flex-col items-center gap-4 p-4 transition-shadow hover:shadow-lg md:flex-row md:justify-between"
        >
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
                <span
                    className={cn("flex items-center gap-2 text-xl font-bold", {
                        "text-yellow-500": index === 0,
                        "text-gray-500": index === 1,
                        "text-orange-500": index === 2,
                        "text-gray-600": index > 2,
                    })}
                >
                    {index < 3 ? <Crown size={24} /> : <User size={24} />} #
                    {index + 1}
                </span>

                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        {player.imageUrl ? (
                            <>
                                <AvatarImage
                                    src={player.imageUrl}
                                    alt={player.name}
                                    className={"aspect-auto object-cover"}
                                />
                                <AvatarFallback>
                                    {player.name[0]}
                                </AvatarFallback>
                            </>
                        ) : (
                            <AvatarFallback>
                                <User size={32} className="text-gray-500" />
                            </AvatarFallback>
                        )}
                    </Avatar>

                    <div className="text-center md:text-left">
                        <p className="text-lg font-semibold">
                            🏐 {player.name}
                        </p>
                        <p className="text-primary">
                            Overall: {calculateOverall(player)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bloco da direita: badge e botões */}
            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row md:justify-end">
                <Badge
                    className={cn(
                        "mb-3 px-3 py-1 text-sm md:text-base",
                        positionColors[assignPosition(player)].bg,
                        positionColors[assignPosition(player)].text,
                    )}
                >
                    {assignPosition(player)}
                </Badge>

                <div
                    className={"flex w-full items-center justify-stretch gap-2"}
                >
                    <Button asChild className="w-full md:w-auto">
                        <Link
                            to={`/admin/player/${player.id}`}
                            className="flex items-center justify-center gap-2"
                        >
                            <Eye size={18} />
                        </Link>
                    </Button>

                    {user && (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full md:w-auto"
                            >
                                <Link
                                    to={`/admin/player/edit/${player.id}`}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={18} />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="destructive"
                                className="w-full md:w-auto"
                            >
                                <Link
                                    to={`/admin/player/remove/${player.id}`}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Trash size={18} />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
