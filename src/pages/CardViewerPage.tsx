import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { usePublicCard } from "@/features/card-viewer/hooks";
import { useViewTracking } from "@/features/card-viewer/hooks/useViewTracking";
import { FlipCard } from "@/features/card-viewer/components/FlipCard";
import { QRCodePanel } from "@/features/card-viewer/components/QRCodePanel";
import { NfcButton } from "@/features/nfc/components/NfcButton";
import { MessageForm } from "@/features/messages/components/MessageForm";
import { useState } from "react";

export default function CardViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { card, loading, error } = usePublicCard(slug);
  const [showQR, setShowQR] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useViewTracking(card?.id, slug);

  const cardUrl = `${window.location.origin}/card/${slug}`;

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Card not found</h1>
        <p className="text-gray-500">{error ?? "This card doesn't exist or is private."}</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <FlipCard card={card} onFlip={(flipped) => setShowQR(flipped)}>
          {showQR && (
            <div className="flex flex-col gap-4">
              <QRCodePanel card={card} cardUrl={cardUrl} />
              <NfcButton url={cardUrl} cardName={`${card.firstName} ${card.lastName}`} />
              <div className="border-t pt-4">
                {!showMessage ? (
                  <Button variant="outline" className="w-full" onClick={() => setShowMessage(true)}>
                    Send Message
                  </Button>
                ) : (
                  <MessageForm card={card} />
                )}
              </div>
            </div>
          )}
        </FlipCard>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Powered by{" "}
            <Link to="/" className="font-medium text-brand hover:underline">
              NownCard
            </Link>{" "}
            — Create yours free
          </p>
        </div>
      </div>
    </div>
  );
}
