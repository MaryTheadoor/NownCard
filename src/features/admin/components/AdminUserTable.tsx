import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useAdminUsers, getUserCardCount } from "../hooks";
import { PlanBadge } from "@/features/payments/components/PlanBadge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/app/providers/ToastProvider";

export function AdminUserTable() {
  const { users, loading } = useAdminUsers();
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    for (const user of users) {
      getUserCardCount(user.uid).then((count) => {
        setCardCounts((prev) => ({ ...prev, [user.uid]: count }));
      });
    }
  }, [users]);

  const handleDeleteUserCards = async () => {
    if (!confirm("Delete all cards for this user?")) return;
    toast({ title: "Use Cloud Function for bulk delete", variant: "error" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-ink-muted">Email</th>
                <th className="pb-3 font-medium text-ink-muted">Name</th>
                <th className="pb-3 font-medium text-ink-muted">Plan</th>
                <th className="pb-3 font-medium text-ink-muted">Cards</th>
                <th className="pb-3 font-medium text-ink-muted">Admin</th>
                <th className="pb-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-b last:border-0">
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="py-3 pr-4">{u.displayName ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <PlanBadge plan={u.plan} />
                  </td>
                  <td className="py-3 pr-4">{cardCounts[u.uid] ?? "..."}</td>
                  <td className="py-3 pr-4">{u.isAdmin ? "Yes" : "No"}</td>
                  <td className="py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger hover:text-danger-dark"
                      onClick={() => handleDeleteUserCards()}
                    >
                      Delete Cards
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
