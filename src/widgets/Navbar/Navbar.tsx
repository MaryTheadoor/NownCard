import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/shared/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-brand">Nown</span>Card
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          {loading ? null : user ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/">Sign In</Link>
            </Button>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            <Link to="/pricing" className="text-sm font-medium" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link to="/" className="text-sm font-medium" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
