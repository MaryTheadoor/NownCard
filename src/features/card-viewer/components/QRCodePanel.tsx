import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/shared/ui/button";
import { Download, Share2, QrCode } from "lucide-react";
import { downloadVCard } from "@/shared/lib/vcard/generateVCard";
import { useToast } from "@/app/providers/ToastProvider";
import type { Card } from "@/shared/api/types";

interface QRCodePanelProps {
  card: Card;
  cardUrl: string;
}

export function QRCodePanel({ card, cardUrl }: QRCodePanelProps) {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadVCard = () => {
    try {
      downloadVCard(card);
      toast({ title: "vCard downloaded", description: "Contact saved to your device", variant: "success" });
    } catch {
      toast({ title: "Download failed", variant: "error" });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.firstName} ${card.lastName} — NownCard`,
          text: `View ${card.firstName} ${card.lastName}'s digital business card`,
          url: cardUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(cardUrl);
      toast({ title: "Link copied!", description: cardUrl, variant: "success" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-3">
        <Button size="lg" variant="outline" onClick={handleDownloadVCard}>
          <Download className="h-4 w-4" /> Save Contact
        </Button>
        <Button size="lg" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>

      <div ref={qrRef} className="rounded-xl bg-white p-4 shadow-sm">
        <QRCodeCanvas value={cardUrl} size={200} level="M" fgColor={card.accentColor} />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <QrCode className="h-4 w-4" />
        <span>Scan to save this card</span>
      </div>
    </div>
  );
}
