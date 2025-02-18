import { iconMapping, labelsLiteral } from "../constants.tsx";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"; // Certifique-se de que este caminho esteja correto

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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

export const EvaluationHelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={"max-h-[90vh] overflow-y-auto"}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        Guia de Avaliação
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {Object.entries(descriptions).map(([key, desc]) => (
                        <div key={key} className="flex items-start">
                            <div className="mt-1 mr-3">{iconMapping[key]}</div>
                            <div>
                                <p className="font-bold text-gray-800">
                                    {
                                        labelsLiteral[
                                            key as keyof typeof labelsLiteral
                                        ]
                                    }
                                </p>
                                <p className="whitespace-pre-line text-gray-600">
                                    {desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter className="mt-6">
                    <Button
                        onClick={onClose}
                        className="w-full bg-red-500 text-white hover:bg-red-600"
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
