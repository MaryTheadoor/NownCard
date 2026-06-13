import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange, type AuthUser } from "@/shared/lib/firebase/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, isAdmin: false });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      // isAdmin will be fetched from Firestore user doc in Phase 2
      setIsAdmin(false);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading, isAdmin }}>{children}</AuthContext.Provider>;
}
