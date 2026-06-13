import { useCallback, useEffect, useState } from "react";
import { getCardBySlug } from "@/shared/api/cards";
import type { Card } from "@/shared/api/types";

export function usePublicCard(slug: string | undefined) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCard = useCallback(async (s: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCardBySlug(s);
      if (result && result.isPublic) {
        setCard(result);
      } else {
        setError("Card not found");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load card");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) loadCard(slug);
  }, [slug, loadCard]);

  return { card, loading, error };
}
