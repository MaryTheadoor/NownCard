import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useSignOut } from "@/features/auth/hooks";
import { Button } from "@/shared/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/widgets/AuthModal/AuthModal";

export function Navbar() {
  const { user, loading } = useAuth();
  const { signOut } = useSignOut();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-brand">Nown</span>Card
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            {loading ? null : user ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t bg-white px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-3 pt-3">
              <Link to="/pricing" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Pricing
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button className="text-left text-sm font-medium text-red-500" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  className="text-left text-sm font-medium text-brand"
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthModalOpen(true);
                  }}
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
