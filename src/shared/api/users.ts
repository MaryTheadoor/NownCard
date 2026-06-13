import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { User } from "./types";

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}

export async function ensureUser(uid: string, email: string | null, displayName: string | null): Promise<User> {
  const existing = await getUser(uid);
  if (existing) {
    await updateDoc(doc(db, "users", uid), {
      email: email ?? existing.email,
      displayName: displayName ?? existing.displayName,
      updatedAt: serverTimestamp(),
    });
    return { ...existing, email: email ?? existing.email, displayName: displayName ?? existing.displayName };
  }

  const newUser: User = {
    email: email ?? "",
    displayName,
    photoURL: null,
    plan: "free",
    isAdmin: false,
    createdAt: serverTimestamp() as unknown as User["createdAt"],
    updatedAt: serverTimestamp() as unknown as User["updatedAt"],
  };

  await setDoc(doc(db, "users", uid), newUser);
  return newUser;
}

export async function updateUser(uid: string, data: Partial<Pick<User, "displayName" | "photoURL">>): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
