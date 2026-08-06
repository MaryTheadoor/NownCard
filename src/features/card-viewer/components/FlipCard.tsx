import { useState } from "react";
import { cn } from "@/shared/lib/utils/cn";
import type { Card } from "@/shared/api/types";

const themeGradients: Record<Card["theme"], string> = {
  cosmic: "from-indigo-600 via-purple-600 to-pink-500",
  warm: "from-amber-500 via-orange-500 to-rose-500",
  minimal: "from-gray-700 via-gray-800 to-gray-900",
};

interface FlipCardProps {
  card: Card;
  onFlip?: (isFlipped: boolean) => void;
  children?: React.ReactNode;
}

export function FlipCard({ card, onFlip, children }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  return (
    <div
      className="group relative cursor-pointer perspective-[1000px]"
      style={{ width: "100%", maxWidth: "400px", aspectRatio: "3/4" }}
      onClick={toggle}
      onKeyDown={(e) => e.key === "Enter" && toggle()}
      tabIndex={0}
      role="button"
      aria-label={flipped ? "Show card front" : "Show card back"}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl [backface-visibility:hidden]">
          {card.backgroundImage ? (
            <img src={card.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br", themeGradients[card.theme])} />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center text-white">
            {card.profileImage ? (
              <img
                src={card.profileImage}
                alt={`${card.firstName} ${card.lastName}`}
                className="mb-6 h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-lg"
              />
            ) : (
              <div
                className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/30 text-4xl font-bold shadow-lg"
                style={{ backgroundColor: card.accentColor }}
              >
                {card.firstName[0]}
                {card.lastName[0]}
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight">
              {card.prefix ? `${card.prefix} ` : ""}
              {card.firstName} {card.lastName}
              {card.suffix ? `, ${card.suffix}` : ""}
            </h2>
            {card.jobTitle && <p className="mt-1 text-lg text-white/80">{card.jobTitle}</p>}
            {card.company && <p className="text-sm text-white/60">{card.company}</p>}
            {card.nickname && <p className="mt-2 text-sm italic text-white/50">&ldquo;{card.nickname}&rdquo;</p>}
            <p className="mt-6 text-xs text-white/40">Tap to flip</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {card.backBackgroundImage || card.backgroundImage ? (
            <img
              src={card.backBackgroundImage || card.backgroundImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: card.backBgPosition ?? card.bgPosition ?? "center",
                transform: card.backBgRotation ? `rotate(${card.backBgRotation}deg)` : undefined,
              }}
            />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br", themeGradients[card.theme])} />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative flex h-full flex-col p-6">
            <div className="mb-4 flex items-center gap-3">
              {card.profileImage ? (
                <img src={card.profileImage} alt="" className="z-10 h-12 w-12 rounded-full border-2 border-white/30 object-cover" />
              ) : (
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 text-lg font-bold text-white" style={{ backgroundColor: card.accentColor }}>
                  {card.firstName[0]}
                  {card.lastName[0]}
                </div>
              )}
              <div className="z-10">
                <p className="font-semibold text-white">
                  {card.firstName} {card.lastName}
                </p>
                {card.jobTitle && <p className="text-xs text-white/70">{card.jobTitle}</p>}
              </div>
            </div>

            {card.bio && <p className="z-10 mb-4 text-sm text-white/80">{card.bio}</p>}

            <div className="z-10 flex-1 space-y-2 overflow-auto">
              {card.phones.map((p, i) => (
                <a
                  key={`phone-${i}`}
                  href={`tel:${p.number}`}
                  className="flex items-center gap-3 rounded-lg p-2 text-sm text-white hover:bg-white/10"
                >
                  <span className="text-brand-yellow">&#9742;</span>
                  <span>{p.number}</span>
                  <span className="text-xs text-white/50">({p.type})</span>
                </a>
              ))}
              {card.emails.map((e, i) => (
                <a
                  key={`email-${i}`}
                  href={`mailto:${e.address}`}
                  className="flex items-center gap-3 rounded-lg p-2 text-sm text-white hover:bg-white/10"
                >
                  <span className="text-brand-yellow">&#9993;</span>
                  <span className="truncate">{e.address}</span>
                </a>
              ))}
              {card.addresses.map((a, i) => (
                <div key={`addr-${i}`} className="flex items-start gap-3 rounded-lg p-2 text-sm text-white">
                  <span className="text-brand-yellow">&#9906;</span>
                  <div>
                    <p className="font-medium">{a.label ?? "Address"}</p>
                    <p className="text-white/70">
                      {[a.street, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
              {card.socialLinks.map((s, i) => (
                <a
                  key={`social-${i}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-2 text-sm text-white hover:bg-white/10"
                >
                  <span className="text-brand-yellow">&#128279;</span>
                  <span>{s.platform}</span>
                </a>
              ))}
            </div>

            <p className="z-10 mt-4 text-center text-xs text-white/40">Tap to flip back</p>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
