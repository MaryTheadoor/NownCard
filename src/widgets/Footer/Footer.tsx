import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-tile-soft">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-ink-muted">
            &copy; {new Date().getFullYear()} NownCard. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/pricing" className="text-sm text-ink-muted hover:text-ink">
              Pricing
            </Link>
            <Link to="/" className="text-sm text-ink-muted hover:text-ink">
              Privacy
            </Link>
            <Link to="/" className="text-sm text-ink-muted hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
