import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminUserTable } from "@/features/admin/components/AdminUserTable";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-ink-muted">You do not have admin privileges.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Admin Panel</h1>
      <AdminUserTable />
    </div>
  );
}
