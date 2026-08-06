import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { onAuthChange, getGoogleRedirectResult, type AuthUser } from "@/shared/lib/firebase/auth";
import { ensureUser } from "@/shared/api/users";
import type { User } from "@/shared/api/types";
import { useToast } from "./ToastProvider";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  plan: User["plan"];
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, isAdmin: false, plan: "free" });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [plan, setPlan] = useState<User["plan"]>("free");
  const { toast } = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    getGoogleRedirectResult()
      .then((user) => {
        if (user) toastRef.current({ title: "Welcome!", description: `Signed in as ${user.email}`, variant: "success" });
      })
      .catch(() => {});

    const unsubscribe = onAuthChange(async (user) => {
      setAuthUser(user);
      if (user) {
        try {
          const userDoc = await ensureUser(user.uid, user.email, user.displayName);
          setIsAdmin(userDoc.isAdmin);
          setPlan(userDoc.plan);
        } catch {
          setIsAdmin(false);
          setPlan("free");
        }
      } else {
        setIsAdmin(false);
        setPlan("free");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user: authUser, loading, isAdmin, plan }}>{children}</AuthContext.Provider>;
}
