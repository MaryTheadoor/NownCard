import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardCards } from "@/features/dashboard/hooks";
import { deleteCard } from "@/shared/api/cards";
import { useToast } from "@/app/providers/ToastProvider";
import { useEffect, useState } from "react";
import type { Card as CardType } from "@/shared/api/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { cards, loading, loadCards } = useDashboardCards();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadCards(user.uid);
  }, [user, loadCards]);

  const handleDelete = async (card: CardType) => {
    if (!confirm(`Delete card for ${card.firstName} ${card.lastName}?`)) return;
    setDeleting(card.id);
    try {
      await deleteCard(card.id);
      toast({ title: "Card deleted", variant: "default" });
      if (user) loadCards(user.uid);
    } catch {
      toast({ title: "Failed to delete card", variant: "error" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your digital business cards</p>
        </div>
        <Button asChild>
          <Link to="/editor">
            <Plus className="h-4 w-4" />
            New Card
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : cards.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-gray-500">No cards yet. Create your first digital business card to get started.</p>
            <Button asChild>
              <Link to="/editor">
                <Plus className="h-4 w-4" />
                Create Your First Card
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">
                  {card.prefix ? `${card.prefix} ` : ""}{card.firstName} {card.lastName}
                </CardTitle>
                <CardDescription>
                  {card.jobTitle && <span>{card.jobTitle}{card.company ? ` at ${card.company}` : ""}</span>}
                  {!card.jobTitle && <span className="text-gray-400">No job title</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">
                  /{card.slug} · {card.viewCount} views · {card.isPublic ? "Public" : "Private"}
                </p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={card.isPublic ? `/card/${card.slug}` : "#"} title={card.isPublic ? "View" : "Not public"}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/editor/${card.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(card)}
                    disabled={deleting === card.id}
                  >
                    {deleting === card.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
