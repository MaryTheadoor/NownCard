import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, User, MapPin, Eye, Download } from "lucide-react";
import { listPublicCards } from "@/shared/api/cards";
import { initials, fullName, orgLine } from "@/shared/lib/utils/helpers";
import type { Card } from "@/shared/api/types";

export default function RolodexPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listPublicCards()
      .then(setCards)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load cards"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? cards.filter((card) => {
        const name = fullName(card).toLowerCase();
        const company = (card.company || "").toLowerCase();
        const slug = (card.slug || "").toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || company.includes(q) || slug.includes(q);
      })
    : cards;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Card Directory</h1>
        <p className="mt-1 text-ink-muted">
          Browse public digital business cards. Search by name, company, or username.
        </p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          placeholder="Search by name, company, or handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-line bg-tile py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-danger-dark bg-danger/10 p-6 text-center text-sm text-danger">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-tile p-12 text-center">
          <p className="text-ink-muted">
            {search ? "No cards match your search." : "No public cards yet. Be the first to create one!"}
          </p>
          <Link
            to="/editor"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-yellow hover:underline"
          >
            Create your card
          </Link>
        </div>
      ) : (
        <div className="sites-grid">
          {filtered.map((card) => {
            const name = fullName(card);
            const org = orgLine(card);
            const init = initials(card.firstName, card.lastName);

            return (
              <Link
                key={card.id}
                to={`/card/${card.slug}`}
                className="sites-tile-card flex flex-col gap-4 no-underline"
              >
                <div className="flex items-start gap-4">
                  {card.profileImage ? (
                    <img
                      src={card.profileImage}
                      alt={name}
                      className="h-14 w-14 rounded-full border-2 object-cover"
                      style={{ borderColor: card.accentColor || "#d4a34a" }}
                    />
                  ) : (
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                      style={{ backgroundColor: card.accentColor || "#d4a34a" }}
                    >
                      {init}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-ink">{name}</h3>
                    {org && (
                      <p className="truncate text-sm text-ink-muted">{org}</p>
                    )}
                    {card.bio && (
                      <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                        {card.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-faint">
                  {card.jobTitle && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {card.jobTitle}
                    </span>
                  )}
                  {card.company && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {card.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {card.viewCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {card.saveCount || 0}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
