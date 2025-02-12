import {
    Hand,
    HandHelping,
    MapPin,
    Repeat,
    Shield,
    Target,
    Volleyball,
} from "lucide-react";

export const playerAttributes = [
    {
        label: "Ataque",
        name: "attack",
        icon: <Target size={20} className="text-red-500" />,
    },
    {
        label: "Eficiência no Saque",
        name: "serve",
        icon: <Volleyball size={20} className="text-orange-500" />,
    },
    {
        label: "Levantamento",
        name: "set",
        icon: <Hand size={20} className="text-yellow-500" />,
    },
    {
        label: "Defesa",
        name: "defense",
        icon: <Shield size={20} className="text-green-500" />,
    },
    {
        label: "Posicionamento",
        name: "positioning",
        icon: <MapPin size={20} className="text-blue-500" />,
    },
    {
        label: "Recepção",
        name: "reception",
        icon: <HandHelping size={20} className="text-indigo-500" />,
    },
    {
        label: "Constância",
        name: "consistency",
        icon: <Repeat size={20} className="text-purple-500" />,
    },
    {
        label: "Bloqueio",
        name: "block",
        icon: (
            <Shield
                size={20}
                className={"text-green-500 transform rotate-45"}
            />
        ),
    },
];
