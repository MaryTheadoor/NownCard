import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/editor">
            <Plus className="h-4 w-4" />
            New Card
          </Link>
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-12">
            No cards yet. Create your first digital business card to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
