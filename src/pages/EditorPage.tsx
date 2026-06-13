import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useParams } from "react-router-dom";

export default function EditorPage() {
  const { cardId } = useParams<{ cardId?: string }>();
  const isNew = !cardId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">{isNew ? "Create Card" : "Edit Card"}</h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="Software Engineer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A brief introduction..." rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">Save Card</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
