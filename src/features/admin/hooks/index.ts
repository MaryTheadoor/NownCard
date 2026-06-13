import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { User } from "@/shared/api/types";
import { listUserCards } from "@/shared/api/cards";

export function useAdminUsers() {
  const [users, setUsers] = useState<(User & { uid: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as User & { uid: string }));
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { users, loading, load };
}

export async function getUserCardCount(uid: string): Promise<number> {
  try {
    const cards = await listUserCards(uid);
    return cards.length;
  } catch {
    return 0;
  }
}
