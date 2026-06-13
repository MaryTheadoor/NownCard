import { useCallback, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { DailyAnalytics } from "@/shared/api/types";

export function useCardAnalytics(cardId: string) {
  const [data, setData] = useState<DailyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const analyticsRef = collection(db, "analytics");
      const q = query(analyticsRef, where("cardId", "==", id), orderBy("date", "desc"), limit(30));
      const snap = await getDocs(q);
      setData(snap.docs.map((d) => d.data() as DailyAnalytics));
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cardId) load(cardId);
  }, [cardId, load]);

  return { data, loading, load };
}
