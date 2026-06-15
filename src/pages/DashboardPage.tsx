import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import {
  Plus, Edit, Trash2, ExternalLink, Loader2, BarChart3, Copy,
  Eye, EyeOff, Radio, MessageSquare, Mail
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardCards } from "@/features/dashboard/hooks";
import { usePlanLimits } from "@/features/payments/hooks";
import { PlanBadge } from "@/features/payments/components/PlanBadge";
import { UpgradePrompt } from "@/features/payments/components/UpgradePrompt";
import { deleteCard, updateCard } from "@/shared/api/cards";
import { getUserMessages } from "@/features/messages/api";
import { useToast } from "@/app/providers/ToastProvider";
import { useEffect, useState } from "react";
import type { Card as CardType, Message } from "@/shared/api/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { cards, loading, loadCards } = useDashboardCards();
  const { plan, canAddCard } = usePlanLimits();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    if (user) loadCards(user.uid);
  }, [user, loadCards]);

  useEffect(() => {
    if (showMessages && user) {
      setMessagesLoading(true);
      getUserMessages(user.uid)
        .then(setMessages)
        .catch(() => setMessages([]))
        .finally(() => setMessagesLoading(false));
    }
  }, [showMessages, user]);

  const unreadCount = messages.filter((m) => !m.read).length;

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

  const handleTogglePublic = async (card: CardType) => {
    try {
      await updateCard(card.id, { isPublic: !card.isPublic });
      toast({
        title: card.isPublic ? "Card is now private" : "Card is now public",
        variant: "success",
      });
      if (user) loadCards(user.uid);
    } catch {
      toast({ title: "Failed to update card", variant: "error" });
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/card/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: url, variant: "success" });
    } catch {
      toast({ title: "Failed to copy", variant: "error" });
    }
  };

  const atLimit = !canAddCard(cards.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-ink-muted">Manage your digital business cards</p>
            <PlanBadge plan={plan} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowMessages(!showMessages)}
          >
            <Mail className="h-4 w-4" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-yellow px-1.5 py-0.5 text-[10px] font-bold text-[#0A0D14]">
                {unreadCount}
              </span>
            )}
          </Button>
          {atLimit ? (
            <Button disabled title="Upgrade to create more cards">
              <Plus className="h-4 w-4" />
              Card Limit Reached
            </Button>
          ) : (
            <Button variant="accent" asChild>
              <Link to="/editor">
                <Plus className="h-4 w-4" />
                New Card
              </Link>
            </Button>
          )}
        </div>
      </div>

      {atLimit && plan === "free" && (
        <div className="mt-4">
          <UpgradePrompt currentPlan={plan} requiredPlan="pro" feature="You've reached the free plan limit. Create more cards with the" />
        </div>
      )}

      {/* Messages Inbox */}
      {showMessages && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages ({messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-yellow" />
              </div>
            ) : messages.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-muted">No messages yet.</p>
            ) : (
              <div className="divide-y">
                {messages.map((msg) => (
                  <div key={msg.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{msg.subject || "No subject"}</p>
                      {!msg.read && (
                        <span className="rounded-full bg-brand-yellow/20 px-2 py-0.5 text-[10px] font-bold text-brand-yellow">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">
                      From: {msg.senderName || "Anonymous"} · Card: /{msg.cardSlug}
                    </p>
                    <p className="mt-1 text-sm">{msg.body}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
        </div>
      ) : cards.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-ink-muted">No cards yet. Create your first digital business card to get started.</p>
            <Button variant="accent" asChild disabled={atLimit}>
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
                  {!card.jobTitle && <span className="text-ink-faint">No job title</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-ink-faint mb-3">
                  /{card.slug} · {card.viewCount} views · {card.isPublic ? "Public" : "Private"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {card.isPublic ? (
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/card/${card.slug}`} target="_blank" title="View">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" disabled title="Card is private">
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  )}
                  {card.isPublic ? (
                    <Button size="sm" variant="ghost" onClick={() => handleTogglePublic(card)} title="Make private">
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => handleTogglePublic(card)} title="Make public">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {card.isPublic && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyLink(card.slug)}
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/editor/${card.id}`} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/analytics/${card.id}`} title="Analytics">
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </Button>
                  {card.isPublic && (
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/nfc/${card.slug}`} title="Write to NFC">
                        <Radio className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(card)}
                    disabled={deleting === card.id}
                    title="Delete"
                  >
                    {deleting === card.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-danger" />
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
