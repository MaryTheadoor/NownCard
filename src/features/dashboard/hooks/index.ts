import { useCallback, useState } from "react";
import { listUserCards } from "@/shared/api/cards";
import type { Card } from "@/shared/api/types";

export function useDashboardCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const result = await listUserCards(uid);
      setCards(result);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cards, loading, loadCards };
}
