import { useCallback, useState } from "react";
import { useToast } from "@/app/providers/ToastProvider";

interface NfcWriterResult {
  writing: boolean;
  supported: boolean;
  write: (url: string, cardName: string) => Promise<void>;
}

export function useNfcWriter(): NfcWriterResult {
  const [writing, setWriting] = useState(false);
  const { toast } = useToast();

  const supported = typeof window !== "undefined" && "NDEFReader" in window;

  const write = useCallback(
    async (url: string, cardName: string) => {
      if (!supported) {
        toast({ title: "NFC not supported", description: "Use a compatible device or browser", variant: "error" });
        return;
      }

      setWriting(true);
      try {
        const ndef = new (window as unknown as { NDEFReader: new () => NDEFReader }).NDEFReader();
        await ndef.write({
          records: [
            { recordType: "url", data: url },
          ],
        });
        toast({ title: "NFC tag written!", description: `Tap tag to open ${cardName}'s card`, variant: "success" });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "NFC write failed";
        toast({ title: "NFC write failed", description: message, variant: "error" });
      } finally {
        setWriting(false);
      }
    },
    [supported, toast],
  );

  return { writing, supported, write };
}

declare class NDEFReader {
  write(data: { records: { recordType: string; data: string }[] }): Promise<void>;
}
