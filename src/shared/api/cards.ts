import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { Card } from "./types";

const cardsCollection = collection(db, "cards");

export interface CreateCardInput {
  ownerUid: string;
  slug: string;
  firstName: string;
  lastName: string;
  prefix?: string;
  middleName?: string;
  suffix?: string;
  nickname?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;
  phones: Card["phones"];
  emails: Card["emails"];
  addresses: Card["addresses"];
  socialLinks: Card["socialLinks"];
  theme: Card["theme"];
  accentColor: string;
  profileImage?: string;
  backgroundImage?: string;
  backBackgroundImage?: string;
  isPublic: boolean;
}

export type UpdateCardInput = Partial<CreateCardInput> & Partial<Pick<Card, "cardTheme" | "fontFamily" | "fontSizeScale" | "textColor" | "bgOpacity" | "viewCount" | "saveCount" | "isTeamCard">>;

export async function createCard(input: CreateCardInput): Promise<Card> {
  const now = serverTimestamp() as unknown as Timestamp;
  const docRef = await addDoc(cardsCollection, {
    ...input,
    isTeamCard: false,
    viewCount: 0,
    saveCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  const snap = await getDoc(docRef);
  return { id: snap.id, ...snap.data() } as Card;
}

export async function getCard(cardId: string): Promise<Card | null> {
  const snap = await getDoc(doc(db, "cards", cardId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Card;
}

export async function updateCard(cardId: string, input: UpdateCardInput): Promise<void> {
  const data: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    data[key] = value === "" ? deleteField() : value
  }
  data.updatedAt = serverTimestamp()
  await updateDoc(doc(db, "cards", cardId), data as any);
}

export async function deleteCard(cardId: string): Promise<void> {
  await deleteDoc(doc(db, "cards", cardId));
}

export async function listUserCards(uid: string): Promise<Card[]> {
  const q = query(cardsCollection, where("ownerUid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Card);
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const q = query(cardsCollection, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Card;
}

export async function isSlugTaken(slug: string, excludeCardId?: string): Promise<boolean> {
  const q = query(cardsCollection, where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return false;
  if (excludeCardId && snap.docs[0].id === excludeCardId) return false;
  return true;
}

export async function listPublicCards(): Promise<Card[]> {
  const q = query(
    cardsCollection,
    where("isPublic", "==", true),
    orderBy("updatedAt", "desc"),
    limit(100),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Card);
}
