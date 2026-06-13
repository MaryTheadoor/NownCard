import { Button } from "@/shared/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useCheckout } from "@/features/payments/hooks";

const plans = [
  {
    name: "Free",
    price: "$0",
    plan: null as "pro" | "business" | null,
    features: ["1 digital card", "3 social links", "Basic themes", "QR code sharing", "vCard downloads"],
    cta: "Current Plan",
    featured: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    plan: "pro" as const,
    features: ["5 digital cards", "Unlimited social links", "All premium themes", "Background images", "Analytics dashboard", "Priority support"],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "$20",
    period: "/month",
    plan: "business" as const,
    features: ["Unlimited cards", "Team cards", "NFC programming", "Custom domains", "White label", "API access"],
    cta: "Upgrade to Business",
    featured: false,
  },
];

export default function PricingPage() {
  const { user, plan: currentPlan } = useAuth();
  const { checkout, loading } = useCheckout();

  const handleCheckout = async (planType: "pro" | "business") => {
    if (!user) {
      // Trigger auth modal - handled by Navbar/HomePage pattern
      return;
    }
    await checkout(planType);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
        <p className="mt-4 text-gray-500">Choose the plan that fits your needs.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${plan.featured ? "border-brand ring-2 ring-brand/20" : ""}`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-gray-500">{plan.period}</span>}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              {plan.plan ? (
                currentPlan === plan.plan ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleCheckout(plan.plan!)}
                    disabled={loading || !user}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.cta}
                  </Button>
                )
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
