import { useCallback, useState } from "react";
import { createCheckoutSession, planConfig, type PlanTier } from "../api";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/app/providers/ToastProvider";

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkout = useCallback(
    async (plan: "pro" | "business") => {
      setLoading(true);
      try {
        const { url } = await createCheckoutSession(plan);
        if (url) {
          window.location.href = url;
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Checkout failed";
        toast({ title: "Checkout failed", description: message, variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { checkout, loading };
}

export function usePlanLimits() {
  const { plan } = useAuth();
  const config = planConfig[plan as PlanTier] ?? planConfig.free;

  function canAddCard(currentCount: number): boolean {
    return currentCount < config.maxCards;
  }

  function canAddField(type: "socialLinks" | "phones" | "emails" | "addresses", currentCount: number): boolean {
    const limits: Record<string, number> = {
      socialLinks: config.maxSocialLinks,
      phones: config.maxPhones,
      emails: config.maxEmails,
      addresses: config.maxAddresses,
    };
    return currentCount < limits[type];
  }

  function canUseTheme(theme: string): boolean {
    return (config.themes as readonly string[]).includes(theme);
  }

  function canUseBackgroundImage(): boolean {
    return config.backgroundImage;
  }

  return {
    plan: plan as PlanTier,
    config,
    canAddCard,
    canAddField,
    canUseTheme,
    canUseBackgroundImage,
  };
}
