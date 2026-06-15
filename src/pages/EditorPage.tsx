import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorForm } from "@/features/card-editor/components/EditorForm";
import { useCardEditor } from "@/features/card-editor/hooks";
import { useAuth } from "@/app/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export default function EditorPage() {
  const { cardId } = useParams<{ cardId?: string }>();
  const { user, loading: authLoading } = useAuth();
  const { card, loading, error, loadCard } = useCardEditor();
  const navigate = useNavigate();

  useEffect(() => {
    if (cardId) {
      loadCard(cardId);
    }
  }, [cardId, loadCard]);

  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const isNew = !cardId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">{isNew ? "Create Card" : "Edit Card"}</h1>
      {error && (
        <div className="mt-4 rounded-lg border border-danger-dark bg-danger/10 p-4 text-sm text-danger">{error}</div>
      )}
      <div className="mt-8">
        <EditorForm card={card} cardId={cardId} loading={loading && !!cardId} />
      </div>
    </div>
  );
}
