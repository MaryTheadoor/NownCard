import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCard, getCard, updateCard, isSlugTaken } from "@/shared/api/cards";
import { generateUniqueSlug, slugify } from "@/shared/lib/utils/slugify";
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

      // Validate required fields
      if (!data.firstName.trim() || !data.lastName.trim()) {
        toast({ title: "Missing required fields", description: "First name and last name are required", variant: "error" });
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

        // Generate unique slug with collision retry
        const base = slugify(`${data.firstName}-${data.lastName}`);
        let slug = generateUniqueSlug(data.firstName, data.lastName);
        let attempts = 0;

        while (attempts < 5) {
          const taken = await isSlugTaken(slug);
          if (!taken) break;
          // Generate new slug with different suffix
          slug = `${base}-${Math.random().toString(36).substring(2, 6)}`;
          attempts++;
        }

        if (attempts >= 5) {
          toast({ title: "Could not generate unique URL", description: "Please try again", variant: "error" });
          return null;
        }

        const card = await createCard({
          ownerUid: user.uid,
          slug,
          ...data,
        });
        toast({ title: "Card created!", description: `/card/${card.slug}`, variant: "success" });
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

export function useCardEditor() {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(false);
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
