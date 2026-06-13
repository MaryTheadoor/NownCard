import { useCallback, useState } from "react";
import { sendMessage } from "../api";
import { useToast } from "@/app/providers/ToastProvider";

export function useSendMessage() {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const send = useCallback(
    async (input: { senderUid: string; recipientUid: string; cardSlug: string; subject: string; body: string }) => {
      setSending(true);
      try {
        await sendMessage(input);
        toast({ title: "Message sent!", variant: "success" });
        return true;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to send";
        toast({ title: "Send failed", description: message, variant: "error" });
        return false;
      } finally {
        setSending(false);
      }
    },
    [toast],
  );

  return { send, sending };
}
