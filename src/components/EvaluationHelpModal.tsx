import {
    Ban,
    Download,
    MapPin,
    Repeat,
    Send,
    Settings,
    Shield,
    X,
    Zap,
} from "lucide-react";
import { ReactElement } from "react";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const labelsLiteral = {
    attack: "Ataque",
    serve: "Eficiência no Saque",
    set: "Levantamento",
    defense: "Defesa",
    positioning: "Posicionamento",
    reception: "Recepção",
    consistency: "Constância",
    block: "Bloqueio",
};

const descriptions = {
    attack: "0-1: Ataques fracos e imprecisos.\n2-3: Ataques razoáveis, mas inconsistentes.\n4-5: Ataques potentes, decisivos e variados.",
    serve: "0-1: Erros frequentes no saque.\n2-3: Saques razoáveis, mas irregulares.\n4-5: Saques precisos e que dificultam a recepção adversária.",
    set: "0-1: Levantamentos imprecisos.\n2-3: Algumas falhas no tempo e na precisão.\n4-5: Levantamentos estratégicos e bem distribuídos.",
    defense:
        "0-1: Pouca reação a ataques adversários.\n2-3: Defesa razoável, mas com falhas.\n4-5: Reflexos rápidos e defesa sólida.",
    positioning:
        "0-1: Posicionamento inadequado, prejudicando a equipe.\n2-3: Posicionamento mediano com alguns erros.\n4-5: Excelente leitura de jogo.",
    reception:
        "0-1: Dificuldade em recepções.\n2-3: Algumas falhas, mas recepção razoável.\n4-5: Recepções seguras e eficazes.",
    consistency:
        "0-1: Muito irregular.\n2-3: Oscila entre bons e maus momentos.\n4-5: Mantém um alto nível de desempenho.",
    block: "0-1: Bloqueios ineficazes.\n2-3: Algumas falhas na leitura de jogadas.\n4-5: Bloqueios bem cronometrados e decisivos.",
};

const iconMapping: { [key: string]: ReactElement } = {
    attack: <Zap className="w-6 h-6 text-blue-500" />,
    serve: <Send className="w-6 h-6 text-green-500" />,
    set: <Settings className="w-6 h-6 text-indigo-500" />,
    defense: <Shield className="w-6 h-6 text-red-500" />,
    positioning: <MapPin className="w-6 h-6 text-yellow-500" />,
    reception: <Download className="w-6 h-6 text-purple-500" />,
    consistency: <Repeat className="w-6 h-6 text-teal-500" />,
    block: <Ban className="w-6 h-6 text-orange-500" />,
};

export const EvaluationHelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    if (!isOpen) return null;

    return (
        // Ao clicar no backdrop, fecha o modal
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            {/* Container responsivo com scroll e clique interrompido para evitar fechamento acidental */}
            <div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    Guia de Avaliação
                </h3>

                <div className="space-y-4">
                    {Object.entries(descriptions).map(([key, desc]) => (
                        <div key={key} className="flex items-start">
                            <div className="mr-3 mt-1">{iconMapping[key]}</div>
                            <div>
                                <p className="font-bold text-gray-800">
                                    {
                                        labelsLiteral[
                                            key as keyof typeof labelsLiteral
                                        ]
                                    }
                                </p>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};
