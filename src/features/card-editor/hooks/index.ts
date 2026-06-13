import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCard, getCard, updateCard, isSlugTaken } from "@/shared/api/cards";
import { generateUniqueSlug } from "@/shared/lib/utils/slugify";
import { useToast } from "@/app/providers/ToastProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import type { CardFormData } from "../types";
import type { Card } from "@/shared/api/types";

export function useSaveCard() {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const save = useCallback(
    async (data: CardFormData, cardId?: string): Promise<Card | null> => {
      if (!user) {
        toast({ title: "Not signed in", description: "Sign in to save cards", variant: "error" });
        return null;
      }

      setSaving(true);
      try {
        if (cardId) {
          await updateCard(cardId, {
            ...data,
            isPublic: data.isPublic,
          });
          toast({ title: "Card updated", variant: "success" });
          navigate("/dashboard");
          return null;
        }

        let slug = generateUniqueSlug(data.firstName, data.lastName);
        let attempts = 0;
        while (await isSlugTaken(slug) && attempts < 5) {
          slug = generateUniqueSlug(data.firstName, data.lastName);
          attempts++;
        }

        const card = await createCard({
          ownerUid: user.uid,
          slug,
          ...data,
        });
        toast({ title: "Card created!", description: `/${card.slug}`, variant: "success" });
        navigate("/dashboard");
        return card;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to save card";
        toast({ title: "Save failed", description: message, variant: "error" });
        return null;
      } finally {
        setSaving(false);
      }
    },
    [user, toast, navigate],
  );

  return { save, saving };
}

export function useCardEditor(cardId?: string) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(!!cardId);
  const [error, setError] = useState<string | null>(null);

  const loadCard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCard(id);
      if (result) {
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

  return { card, loading, error, loadCard };
}
