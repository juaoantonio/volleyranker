import { db } from "./firebase"; // seu arquivo de configuração do firebase
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { Evaluation } from "../types/game.ts";

const evaluationCollectionRef = collection(db, "evaluations");

export const evaluationService = {
    createEvaluation: async (evaluation: Evaluation) => {
        evaluation.createdAt = new Date().toISOString();
        return await addDoc(evaluationCollectionRef, evaluation);
    },

    getEvaluationsByGameId: async (gameId: string) => {
        const q = query(evaluationCollectionRef, where("gameId", "==", gameId));
        const querySnapshot = await getDocs(q);
        const evaluations: Evaluation[] = [];
        querySnapshot.forEach((doc) => {
            evaluations.push({ id: doc.id, ...doc.data() } as Evaluation);
        });
        return evaluations;
    },

    removeEvaluation: async (evaluationId: string) => {
        await deleteDoc(doc(db, "evaluations", evaluationId));
    },

    removeAllEvaluationsByGameId: async (gameId: string) => {
        const evaluations =
            await evaluationService.getEvaluationsByGameId(gameId);
        for (const evaluation of evaluations) {
            await evaluationService.removeEvaluation(evaluation.id!);
        }
    },

    removeEvaluationByPlayerId: async (playerId: string) => {
        const q = query(
            evaluationCollectionRef,
            where("playerId", "==", playerId),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            evaluationService.removeEvaluation(doc.id);
        });
    },
};
