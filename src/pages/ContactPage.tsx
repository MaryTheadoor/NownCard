import { Button } from "@/shared/ui/button";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-ink-muted">We'd love to hear from you.</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-line bg-tile p-6">
          <h2 className="text-lg font-semibold">General Inquiries</h2>
          <p className="mt-2 text-sm text-ink-muted">
            For questions about NownCard, feature requests, or general feedback, reach out to us via email.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="mailto:hello@nowncard.com">
              <Mail className="h-4 w-4" /> hello@nowncard.com
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-line bg-tile p-6">
          <h2 className="text-lg font-semibold">Support</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Having trouble with your account or cards? Our support team is here to help.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="mailto:support@nowncard.com">
              <Mail className="h-4 w-4" /> support@nowncard.com
            </a>
          </Button>
        </div>

        <div className="rounded-xl border border-line bg-tile p-6">
          <h2 className="text-lg font-semibold">Business & Partnerships</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Interested in bulk cards for your team or a partnership opportunity? Let's talk.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="mailto:business@nowncard.com">
              <Mail className="h-4 w-4" /> business@nowncard.com
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
