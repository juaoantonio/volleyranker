import {
    Ban,
    Hand,
    HandHelping,
    MapPin,
    Repeat,
    Shield,
    Target,
    Volleyball,
} from "lucide-react";
import { ReactElement } from "react";

export const labelsLiteral = {
    attack: "Ataque",
    serve: "Eficiência no Saque",
    set: "Levantamento",
    defense: "Defesa",
    positioning: "Posicionamento",
    reception: "Recepção",
    consistency: "Constância",
    block: "Bloqueio",
};

export const iconMapping: { [key: string]: ReactElement } = {
    attack: <Target className="h-6 w-6 text-amber-500" />,
    serve: <Volleyball className="h-6 w-6 text-green-500" />,
    set: <Hand className="h-6 w-6 text-indigo-500" />,
    defense: <Shield className="h-6 w-6 text-orange-500" />,
    positioning: <MapPin className="h-6 w-6 text-blue-500" />,
    reception: <HandHelping className="h-6 w-6 text-purple-500" />,
    consistency: <Repeat className="h-6 w-6 text-teal-500" />,
    block: <Ban className="h-6 w-6 text-red-500" />,
};

export const playerAttributes = [
    {
        label: "Ataque",
        name: "attack",
        icon: <Target size={20} className="text-amber-500" />,
    },
    {
        label: "Eficiência no Saque",
        name: "serve",
        icon: <Volleyball size={20} className="text-green-500" />,
    },
    {
        label: "Levantamento",
        name: "set",
        icon: <Hand size={20} className="text-indigo-500" />,
    },
    {
        label: "Defesa",
        name: "defense",
        icon: <Shield size={20} className="text-orange-500" />,
    },
    {
        label: "Posicionamento",
        name: "positioning",
        icon: <MapPin size={20} className="text-blue-500" />,
    },
    {
        label: "Recepção",
        name: "reception",
        icon: <HandHelping size={20} className="text-purple-500" />,
    },
    {
        label: "Constância",
        name: "consistency",
        icon: <Repeat size={20} className="text-teal-500" />,
    },
    {
        label: "Bloqueio",
        name: "block",
        icon: <Ban size={20} className={"text-red-500"} />,
    },
];
