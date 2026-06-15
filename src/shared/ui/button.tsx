import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-[0.02em] select-none no-underline outline-none cursor-pointer transition-[transform,border-bottom-width,box-shadow,background] duration-100 ease-[ease] disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-foreground bg-tile-raised border border-line border-b-4 border-b-black/[0.2] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[color-mix(in_srgb,var(--tile-raised)_90%,white)] hover:shadow-[0_5px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        destructive:
          "text-white bg-danger border border-danger border-b-4 border-b-danger-dark rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[color-mix(in_srgb,var(--danger)_85%,white)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        outline:
          "text-foreground bg-tile border border-line border-b-[3px] border-b-black/[0.2] rounded-lg shadow-[0_3px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[color-mix(in_srgb,var(--tile-raised)_90%,white)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-px active:translate-y-[2px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        secondary:
          "text-foreground bg-tile-raised border border-line border-b-4 border-b-black/[0.2] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[color-mix(in_srgb,var(--tile-raised)_90%,white)] hover:shadow-[0_5px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        ghost:
          "text-ink-muted bg-transparent border border-transparent border-b-0 rounded-full shadow-none hover:bg-tile-soft hover:text-foreground hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:-translate-y-px active:scale-[0.97] active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        link: "text-ink underline-offset-4 hover:underline p-0 h-auto font-normal tracking-normal shadow-none border-0 bg-transparent",
        accent:
          "text-[#0A0D14] bg-brand-yellow border border-brand-yellow border-b-4 border-b-black/[0.3] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-brand-yellow-hover hover:shadow-[0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        blue:
          "text-white bg-accent-blue border border-accent-blue border-b-4 border-b-[#1a4a99] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-accent-blue-hover hover:shadow-[0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
        purple:
          "text-white bg-accent-purple border border-accent-purple border-b-4 border-b-black/[0.3] rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[color-mix(in_srgb,var(--accent-purple)_85%,white)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px active:translate-y-[3px] active:border-b active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2",
      },
      size: {
        xs: "px-3 py-1 text-xs rounded-md",
        sm: "px-3.5 py-1.5 text-xs rounded-md",
        default: "px-4 py-2 text-sm",
        lg: "px-6 py-2.5 text-sm",
        xl: "px-7 py-3 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
