import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/shared/lib/firebase/init";

const functions = getFunctions(app);

interface CreateCheckoutResult {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(plan: "pro" | "business"): Promise<CreateCheckoutResult> {
  const callable = httpsCallable<{ plan: string }, CreateCheckoutResult>(functions, "createCheckoutSession");
  const result = await callable({ plan });
  return result.data;
}

export const planConfig = {
  free: {
    maxCards: 1,
    maxSocialLinks: 3,
    maxPhones: 2,
    maxEmails: 2,
    maxAddresses: 2,
    themes: ["minimal" as const],
    backgroundImage: false,
    customDomain: false,
    analytics: false,
  },
  pro: {
    maxCards: 5,
    maxSocialLinks: Infinity,
    maxPhones: 5,
    maxEmails: 5,
    maxAddresses: 5,
    themes: ["cosmic" as const, "warm" as const, "minimal" as const],
    backgroundImage: true,
    customDomain: false,
    analytics: true,
  },
  business: {
    maxCards: Infinity,
    maxSocialLinks: Infinity,
    maxPhones: Infinity,
    maxEmails: Infinity,
    maxAddresses: Infinity,
    themes: ["cosmic" as const, "warm" as const, "minimal" as const],
    backgroundImage: true,
    customDomain: true,
    analytics: true,
  },
} as const;

export type PlanConfig = typeof planConfig;
export type PlanTier = keyof typeof planConfig;

export function isPlanAtLeast(current: PlanTier, required: PlanTier): boolean {
  const tiers: PlanTier[] = ["free", "pro", "business"];
  return tiers.indexOf(current) >= tiers.indexOf(required);
}
