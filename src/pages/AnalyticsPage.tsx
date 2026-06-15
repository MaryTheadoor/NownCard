import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useCardAnalytics } from "@/features/analytics/hooks";
import { getCard } from "@/shared/api/cards";
import { lazy, Suspense, useEffect, useState } from "react";
import type { Card as CardType } from "@/shared/api/types";

const AnalyticsChart = lazy(() =>
  import("@/features/analytics/components/AnalyticsChart").then((m) => ({ default: m.AnalyticsChart })),
);

export default function AnalyticsPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const { data, loading } = useCardAnalytics(cardId ?? "");
  const [card, setCard] = useState<CardType | null>(null);

  useEffect(() => {
    if (cardId) {
      getCard(cardId).then(setCard).catch(() => setCard(null));
    }
  }, [cardId]);

  const totalViews = data.reduce((sum, d) => sum + d.views, 0);
  const totalSaves = data.reduce((sum, d) => sum + d.saves, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">
        Analytics{card ? ` — ${card.firstName} ${card.lastName}` : ""}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-ink-muted">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalViews}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-ink-muted">Total Saves</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalSaves}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Daily Views & Saves</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="flex h-72 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-ink-faint" /></div>}>
                <AnalyticsChart data={data} />
              </Suspense>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
