export const GOOGLE_FONTS = [
  { name: "Manrope", value: "Manrope" },
  { name: "Inter", value: "Inter" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Oswald", value: "Oswald" },
  { name: "Roboto Mono", value: "Roboto Mono" },
  { name: "Lora", value: "Lora" },
  { name: "Bebas Neue", value: "Bebas Neue" },
  { name: "Poppins", value: "Poppins" },
  { name: "Space Grotesk", value: "Space Grotesk" },
  { name: "DM Sans", value: "DM Sans" },
] as const;

export const SOCIAL_PLATFORMS = [
  { name: "LinkedIn", value: "linkedin" },
  { name: "X / Twitter", value: "twitter" },
  { name: "GitHub", value: "github" },
  { name: "Instagram", value: "instagram" },
  { name: "YouTube", value: "youtube" },
  { name: "Facebook", value: "facebook" },
  { name: "TikTok", value: "tiktok" },
  { name: "Threads", value: "threads" },
  { name: "Bluesky", value: "bluesky" },
  { name: "Snapchat", value: "snapchat" },
  { name: "Pinterest", value: "pinterest" },
  { name: "Discord", value: "discord" },
  { name: "Website", value: "website" },
  { name: "Other", value: "other" },
] as const;

export const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X/Twitter",
  x: "X/Twitter",
  github: "GitHub",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
  website: "Website",
  threads: "Threads",
  bluesky: "Bluesky",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
  discord: "Discord",
  other: "Other",
};

export const PAYMENT_PLATFORMS = [
  { name: "Cash App", value: "cashapp" },
  { name: "Venmo", value: "venmo" },
  { name: "PayPal", value: "paypal" },
  { name: "Zelle", value: "zelle" },
  { name: "Apple Pay", value: "applepay" },
  { name: "Google Pay", value: "googlepay" },
  { name: "Stripe", value: "stripe" },
  { name: "Other", value: "other" },
] as const;

export const PAYMENT_PLATFORM_LABELS: Record<string, string> = {
  cashapp: "Cash App",
  venmo: "Venmo",
  paypal: "PayPal",
  zelle: "Zelle",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  stripe: "Stripe",
};

import type { Card } from "@/shared/api/types";

export function initials(first?: string, last?: string): string {
  const f = (first || "").trim().charAt(0).toUpperCase();
  const l = (last || "").trim().charAt(0).toUpperCase();
  return f + l || "?";
}

export function fullName(card: Partial<Card>): string {
  return [
    card.prefix,
    card.firstName,
    card.middleName,
    card.lastName,
    card.suffix,
  ]
    .filter(Boolean)
    .join(" ");
}

export function orgLine(card: Partial<Card>): string {
  return [
    card.jobTitle,
    card.department ? `(${card.department})` : undefined,
    card.company,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatAddress(a: {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zip?: string;
  country?: string;
}): string {
  const code =
    (a as { postalCode?: string; zip?: string }).postalCode ||
    (a as { zip?: string }).zip;
  return [
    a.street,
    a.city,
    a.state,
    code,
    a.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const [R, G, B] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function isLightBg(hex: string): boolean {
  return getLuminance(hex) > 0.5;
}

export function shareNative(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<void> | null {
  if (typeof navigator !== "undefined" && navigator.share) {
    return navigator.share(data).catch(() => {});
  }
  return null;
}
