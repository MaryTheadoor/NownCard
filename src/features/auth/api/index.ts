import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, resetPassword as firebaseResetPassword } from "@/shared/lib/firebase/auth";
import type { AuthUser } from "@/shared/lib/firebase/auth";

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  return signInWithEmail(email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<AuthUser> {
  return signUpWithEmail(email, password);
}

export async function loginWithGoogle(): Promise<AuthUser> {
  return signInWithGoogle();
}

export async function logout(): Promise<void> {
  return signOutUser();
}

export async function sendPasswordReset(email: string): Promise<void> {
  return firebaseResetPassword(email);
}
