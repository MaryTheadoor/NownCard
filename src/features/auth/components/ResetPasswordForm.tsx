import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useResetPassword } from "../hooks";

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  onBackToSignIn: () => void;
}

export function ResetPasswordForm({ onBackToSignIn }: ResetPasswordFormProps) {
  const { reset, loading, sent } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    await reset(data.email);
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <Mail className="mx-auto h-10 w-10 text-brand-yellow" />
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-ink-muted">
          We sent a password reset link. Follow the instructions in the email to reset your password.
        </p>
        <Button variant="ghost" onClick={onBackToSignIn} className="w-full">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-ink-muted">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input id="reset-email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" variant="blue" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
      </Button>
      <button type="button" onClick={onBackToSignIn} className="w-full text-center text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="inline h-3 w-3" /> Back to sign in
      </button>
    </form>
  );
}
