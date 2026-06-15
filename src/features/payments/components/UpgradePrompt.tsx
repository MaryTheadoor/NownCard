import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import type { PlanTier } from "../api";

interface UpgradePromptProps {
  currentPlan: PlanTier;
  requiredPlan: PlanTier;
  feature: string;
}

export function UpgradePrompt({ currentPlan, requiredPlan, feature }: UpgradePromptProps) {
  if (currentPlan === "business") return null;

  return (
    <div className="rounded-xl border-2 border-brand-yellow/20 bg-brand-yellow/5 p-6 text-center">
      <Crown className="mx-auto h-8 w-8 text-brand-yellow" />
      <h3 className="mt-3 font-semibold">Upgrade to {requiredPlan === "pro" ? "Pro" : "Business"}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        {feature} {requiredPlan === "pro" ? "Pro" : "Business"} plan.
      </p>
      <Button className="mt-4" asChild>
        <Link to="/pricing">
          View Plans <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
