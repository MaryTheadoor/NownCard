import { useCallback, useState } from "react";
import { loginWithEmail, registerWithEmail, loginWithGoogle, logout } from "../api";
import { useToast } from "@/app/providers/ToastProvider";
import type { AuthUser } from "@/shared/lib/firebase/auth";

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthUser | null> => {
      setLoading(true);
      setError(null);
      try {
        const user = await loginWithEmail(email, password);
        toast({ title: "Welcome back!", description: `Signed in as ${user.email}`, variant: "success" });
        return user;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to sign in";
        setError(message);
        toast({ title: "Sign in failed", description: message, variant: "error" });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { signIn, loading, error };
}

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthUser | null> => {
      setLoading(true);
      setError(null);
      try {
        const user = await registerWithEmail(email, password);
        toast({ title: "Account created!", description: "Welcome to NownCard", variant: "success" });
        return user;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to create account";
        setError(message);
        toast({ title: "Sign up failed", description: message, variant: "error" });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { signUp, loading, error };
}

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const signInWithGoogle = useCallback(async (): Promise<AuthUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      toast({ title: "Welcome!", description: `Signed in as ${user.email}`, variant: "success" });
      return user;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign in with Google";
      setError(message);
      toast({ title: "Google sign in failed", description: message, variant: "error" });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { signInWithGoogle, loading, error };
}

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      toast({ title: "Signed out", variant: "default" });
    } catch {
      toast({ title: "Sign out failed", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { signOut, loading };
}
