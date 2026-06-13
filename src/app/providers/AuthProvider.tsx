import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange, type AuthUser } from "@/shared/lib/firebase/auth";
import { ensureUser } from "@/shared/api/users";
import type { User } from "@/shared/api/types";

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

  useEffect(() => {
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
