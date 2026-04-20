"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { adminLogin, adminMe } from "./api";
import { clearAdminToken, readAdminToken, writeAdminToken } from "./token";

type AdminAuthContextValue = {
  isAdmin: boolean;
  /** True until the first session check finishes (token in storage or not). */
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = readAdminToken();
      if (!token) {
        if (!cancelled) {
          setIsAdmin(false);
          setAuthReady(true);
        }
        return;
      }
      const ok = await adminMe(token);
      if (cancelled) return;
      if (!ok) clearAdminToken();
      setIsAdmin(ok);
      setAuthReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await adminLogin(email, password);
    writeAdminToken(token);
    const ok = await adminMe(token);
    if (!ok) {
      clearAdminToken();
      throw new Error("Session could not be verified");
    }
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, authReady, login, logout }),
    [isAdmin, authReady, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
