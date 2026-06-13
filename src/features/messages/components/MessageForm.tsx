import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useSendMessage } from "../hooks";
import { useAuth } from "@/app/providers/AuthProvider";
import type { Card } from "@/shared/api/types";

interface MessageFormProps {
  card: Card;
}

export function MessageForm({ card }: MessageFormProps) {
  const { user } = useAuth();
  const { send, sending } = useSendMessage();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await send({
      senderUid: user?.uid ?? "anonymous",
      recipientUid: card.ownerUid,
      cardSlug: card.slug,
      subject,
      body,
    });
    if (ok) {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="rounded-xl border bg-green-50 p-6 text-center">
        <p className="font-medium text-green-700">Message sent!</p>
        <p className="mt-1 text-sm text-green-600">{card.firstName} will receive your message.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <h3 className="font-semibold">Send a message</h3>
      <div className="space-y-2">
        <Label htmlFor="msg-subject">Subject</Label>
        <Input id="msg-subject" placeholder="Hello!" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="msg-body">Message</Label>
        <Textarea id="msg-body" placeholder="Write your message..." rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={sending}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
