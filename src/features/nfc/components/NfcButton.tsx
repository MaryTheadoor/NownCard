import { Button } from "@/shared/ui/button";
import { Loader2, Radio } from "lucide-react";
import { useNfcWriter } from "../hooks";

interface NfcButtonProps {
  url: string;
  cardName: string;
}

export function NfcButton({ url, cardName }: NfcButtonProps) {
  const { write, writing, supported } = useNfcWriter();

  if (!supported) return null;

  return (
    <Button variant="outline" size="lg" onClick={() => write(url, cardName)} disabled={writing}>
      {writing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
      {writing ? "Writing..." : "Write to NFC Tag"}
    </Button>
  );
}
