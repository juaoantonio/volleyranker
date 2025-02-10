import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import { Player } from "../types/player";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ✅ Inicializa o Firebase App e Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const playerCollection = collection(db, "players");

// ✅ Adicionar jogador ao Firestore
export const addPlayer = async (player: Player): Promise<void> => {
  await addDoc(playerCollection, player);
};

// ✅ Obter jogadores com tipagem correta
export const getPlayers = async (): Promise<Player[]> => {
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(playerCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Player),
  }));
};

// ✅ Atualizar jogador no Firestore
export const updatePlayer = async (
  id: string,
  updatedPlayer: Partial<Player>,
): Promise<void> => {
  const playerDoc = doc(db, "players", id);
  await updateDoc(playerDoc, updatedPlayer);
};

// ✅ Remover jogador do Firestore
export const removePlayer = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "players", id));
};
