import { useEffect } from "react";
import type { Card } from "@/shared/api/types";

export function useCardFont(card: Partial<Card> | null) {
  useEffect(() => {
    if (!card?.fontFamily || card.fontFamily === "Manrope") return;

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      encodeURIComponent(card.fontFamily) +
      ":wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [card?.fontFamily]);

  useEffect(() => {
    if (!card?.customFontUrl) return;

    const safeUrl = card.customFontUrl.replace(/'/g, "");
    const style = document.createElement("style");
    style.textContent =
      "@font-face { font-family: 'EditorCustomFont'; src: url('" +
      safeUrl +
      "'); font-weight: 400 800; font-display: swap; }";
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [card?.customFontUrl]);
}
