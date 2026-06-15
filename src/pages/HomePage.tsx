import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ArrowRight, QrCode, Share2, Download } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { AuthModal } from "@/widgets/AuthModal/AuthModal";
import { DemoCard } from "@/widgets/DemoCard/DemoCard";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleCta = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Digital Business Cards
          <br />
          <span className="text-brand-yellow">That Work Everywhere</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-muted">
          Create a beautiful digital card in seconds. Share via link, QR code, or NFC tap. Download as a vCard. No app
          required for recipients.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="xl" variant="accent" onClick={handleCta}>
            Create Your Card <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link to="/pricing">View Plans</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="flex justify-center order-2 lg:order-1">
            <DemoCard />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">
              See it in action
            </h2>
            <p className="text-lg text-ink-muted">
              This is exactly what your card looks like — flip it, scan the QR code, and save to contacts. Fully customizable with your colors, images, and information.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: QrCode, title: "QR Code Sharing", desc: "Anyone can scan your QR code to instantly view your card." },
                { icon: Share2, title: "Share Anywhere", desc: "Send your card link via text, email, or social media." },
                { icon: Download, title: "Download as vCard", desc: "Recipients can save your contact info to their phone." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-3 rounded-xl border border-line p-6 text-center glass-panel">
                  <div className="rounded-lg bg-brand-yellow/10 p-3">
                    <Icon className="h-6 w-6 text-brand-yellow" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-ink-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
