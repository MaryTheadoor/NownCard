import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { downloadVCard } from "@/shared/lib/vcard/generateVCard";
import { fullName, shareNative, PLATFORM_LABELS } from "@/shared/lib/utils/helpers";
import type { Card } from "@/shared/api/types";
import { useCardTheme } from "@/features/card-editor/hooks/useCardTheme";
import { Download, Save, QrCode, Share2 } from "lucide-react";

const DEMO_CARD: Partial<Card> = {
  id: "demo",
  slug: "jane-doe",
  prefix: "Dr.",
  firstName: "Jane",
  lastName: "Doe",
  jobTitle: "Product Designer",
  company: "NownCard",
  phones: [{ type: "cell", number: "+1 555 123 4567" }],
  emails: [{ type: "work", address: "jane@example.com" }],
  addresses: [
    {
      label: "Office",
      street: "123 Design Ave",
      city: "San Francisco",
      state: "CA",
      country: "USA",
    },
  ],
  bio: "Building beautiful digital experiences. Always happy to connect.",
  cardTheme: "dark",
  accentColor: "#d4a34a",
  isPublic: true,
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com/in/janedoe" },
    { platform: "twitter", url: "https://twitter.com/janedoe" },
    { platform: "github", url: "https://github.com/janedoe" },
  ],
};

export function DemoCard() {
  const [flipped, setFlipped] = useState(false);
  const card = DEMO_CARD;
  const name = fullName(card);
  const cardUrl =
    (typeof window !== "undefined" ? window.location.origin : "") +
    "/card/" +
    card.slug;
  const theme = useCardTheme(card);
  const init = `${(card.firstName || "").charAt(0)}${(card.lastName || "").charAt(0)}`.toUpperCase() || "?";

  const handleFlip = () => setFlipped((f) => !f);

  const handleDownloadVCard = () => {
    downloadVCard(card, undefined, cardUrl);
  };

  const handleShare = () => {
    const p = shareNative({ title: name, url: cardUrl });
    if (!p) {
      navigator.clipboard.writeText(cardUrl).catch(() => {});
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto">
      <div
        className="w-full perspective-1200 relative cursor-pointer"
        style={{ aspectRatio: "2/3.5" }}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleFlip();
          }
        }}
        role="button"
        aria-label="Flip demo card"
        tabIndex={0}
      >
        <div
          className="w-full h-full preserve-3d transition-transform duration-[800ms]"
          style={{
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: flipped ? "rotateY(180deg)" : undefined,
          }}
        >
          {/* Front */}
          <div
            className="card-face flex flex-col"
            style={{ backgroundColor: theme.tc.faceBg }}
          >
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-5 text-center">
              <div className="mb-4">
                <div
                  className="flex items-center justify-center font-extrabold border-[3px] shadow-lg mx-auto rounded-full"
                  style={{
                    width: 72,
                    height: 72,
                    borderColor: theme.accent,
                    backgroundColor: card.accentColor,
                  }}
                >
                  <span className="text-white text-2xl font-bold">{init}</span>
                </div>
              </div>

              <div className="font-extrabold leading-tight tracking-tight text-lg"
                style={{ color: theme.primaryTextColor }}>
                {name}
              </div>
              {card.jobTitle && (
                <div className="font-semibold mt-1 text-sm"
                  style={{ color: theme.primaryTextColor, opacity: 0.7 }}>
                  {card.jobTitle} · {card.company}
                </div>
              )}

              {card.bio && (
                <>
                  <div className="h-px w-full my-3" style={{ background: `linear-gradient(to right, transparent, ${theme.tc.divider}, transparent)` }} />
                  <div className="w-full max-w-[260px] mx-auto rounded-xl px-4 py-3 mb-2 border border-white/10">
                    <p className="leading-relaxed text-xs" style={{ color: theme.primaryTextColor, opacity: 0.6 }}>
                      {card.bio}
                    </p>
                  </div>
                </>
              )}

              <div className="h-px w-full my-2" style={{ background: `linear-gradient(to right, transparent, ${theme.tc.divider}, transparent)` }} />

              {card.socialLinks?.length && (
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {card.socialLinks.map((s, i) => (
                    <span
                      key={`s-${i}`}
                      className="px-3 py-1 rounded-full font-bold text-[11px] tracking-wide border border-white/10 text-white/60"
                    >
                      {PLATFORM_LABELS[s.platform.toLowerCase()] || s.platform}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 text-[10px] opacity-30 text-white">Tap to flip</p>
            </div>
          </div>

          {/* Back */}
          <div
            className="card-face flex flex-col"
            style={{
              transform: "rotateY(180deg) translateZ(3px)",
              backgroundColor: theme.tc.faceBg,
            }}
          >
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-7 text-center overflow-y-auto">
              <div className="font-extrabold mb-1 text-lg"
                style={{ color: theme.primaryTextColor }}>
                {name}
              </div>
              <div className="mb-5 text-xs opacity-50" style={{ color: theme.primaryTextColor }}>
                Scan to save
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm mb-5">
                <QRCodeCanvas value={cardUrl} size={150} level="M" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center mt-5 w-full">
        <button
          onClick={handleDownloadVCard}
          className="glass-button-accent flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
        >
          <Download className="h-4 w-4" /> Save to Contacts
        </button>
        <button
          onClick={handleFlip}
          className="glass-button flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
        >
          {flipped ? <Save className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
          {flipped ? "Show Card" : "Show QR"}
        </button>
        <button
          onClick={handleShare}
          className="glass-button flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  );
}
