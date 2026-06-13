import { useEffect, useRef } from "react";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

function getDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useViewTracking(cardId: string | undefined, slug: string | undefined) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!cardId || tracked.current) return;
    tracked.current = true;

    const date = getDateString();
    setDoc(
      doc(db, "analytics", cardId, date),
      {
        cardId,
        date,
        views: increment(1),
        saves: increment(0),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => {
      // Analytics write failures are non-critical
    });
  }, [cardId, slug]);
}
