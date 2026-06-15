import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-brand-yellow">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 max-w-md text-ink-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="accent" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/rolodex">Browse Cards</Link>
        </Button>
      </div>
    </div>
  );
}
