import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { Game } from "../types/game";
import { db } from "./firebase.ts";

const gameCollection = collection(db, "games");

export const gameService = {
  /**
   * Cria um novo jogo no Firestore.
   * @param game Dados do jogo a ser criado.
   * @returns ID do jogo criado.
   */
  async createGame(game: Omit<Game, "id">) {
    try {
      const newGame = { ...game };
      const docRef = await addDoc(gameCollection, newGame);
      return { ...newGame, id: docRef.id };
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      throw error;
    }
  },

  /**
   * Obtém todos os jogos da coleção "games".
   * @returns Lista de jogos.
   */
  async getAllGames(): Promise<Game[]> {
    try {
      const querySnapshot = await getDocs(gameCollection);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Game,
      );
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      throw error;
    }
  },

  /**
   * Obtém um jogo pelo ID.
   * @param gameId ID do jogo a ser buscado.
   * @returns Dados do jogo encontrado.
   */
  async getGameById(gameId: string): Promise<Game | null> {
    try {
      const gameDoc = await getDoc(doc(db, "games", gameId)); // Corrigido para "games"
      return gameDoc.exists()
        ? ({ id: gameDoc.id, ...gameDoc.data() } as Game)
        : null;
    } catch (error) {
      console.error("Erro ao buscar jogo:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um jogo no Firestore.
   * @param gameId ID do jogo a ser atualizado.
   * @param updatedData Dados atualizados do jogo.
   */
  async updateGame(gameId: string, updatedData: Partial<Game>) {
    try {
      await updateDoc(doc(db, "games", gameId), updatedData); // Corrigido para "games"
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      throw error;
    }
  },

  /**
   * Deleta um jogo pelo ID.
   * @param gameId ID do jogo a ser removido.
   */
  async deleteGame(gameId: string) {
    try {
      await deleteDoc(doc(db, "games", gameId)); // Corrigido para "games"
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      throw error;
    }
  },
};
