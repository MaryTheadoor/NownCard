import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["1 digital card", "3 social links", "Basic themes", "QR code sharing", "vCard downloads"],
    cta: "Get Started",
    href: "/dashboard",
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    featured: true,
    features: ["5 digital cards", "Unlimited social links", "All premium themes", "Analytics dashboard", "Priority support"],
    cta: "Upgrade to Pro",
    href: "/dashboard",
  },
  {
    name: "Business",
    price: "$20",
    period: "/month",
    features: ["Unlimited cards", "Team cards", "NFC programming", "Admin controls", "White label", "API access"],
    cta: "Upgrade to Business",
    href: "/dashboard",
  },
];

export default function PricingPage() {
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
              <Button variant={plan.featured ? "default" : "outline"} className="w-full" asChild>
                <Link to={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
