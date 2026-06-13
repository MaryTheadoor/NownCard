import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Download, Share2, QrCode } from "lucide-react";

export default function CardViewerPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-brand/40 to-brand" />
        <CardContent className="pt-6 text-center">
          <div className="-mt-16 mx-auto h-24 w-24 rounded-full border-4 border-white bg-gray-200" />
          <h2 className="mt-4 text-xl font-bold">Card: {slug}</h2>
          <p className="text-sm text-gray-500">Full card details coming in Phase 3-4</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button size="sm" variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
