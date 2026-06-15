import { cn } from "@/shared/lib/utils/cn";
import type { PlanTier } from "../api";

const planStyles: Record<PlanTier, string> = {
  free: "bg-tile-soft text-ink-muted",
  pro: "bg-brand-yellow/10 text-brand-yellow",
  business: "bg-accent-purple/20 text-accent-purple",
};

const planLabels: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
};

interface PlanBadgeProps {
  plan: PlanTier;
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", planStyles[plan], className)}>
      {planLabels[plan]}
    </span>
  );
}
