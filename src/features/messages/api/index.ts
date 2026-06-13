import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { Message } from "@/shared/api/types";

const messagesCollection = collection(db, "messages");

export async function sendMessage(input: {
  senderUid: string;
  recipientUid: string;
  cardSlug: string;
  subject: string;
  body: string;
}): Promise<Message> {
  await addDoc(messagesCollection, {
    ...input,
    read: false,
    createdAt: serverTimestamp(),
  });
  return {
    ...input,
    read: false,
    createdAt: {} as Timestamp,
  };
}

export async function getUserMessages(uid: string): Promise<Message[]> {
  const q = query(messagesCollection, where("recipientUid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Message);
}
