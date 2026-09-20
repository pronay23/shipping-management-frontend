"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getCurrentEmployee } from "../api/getCurrentEmployee";
import { loginEmployee } from "../api/loginEmployee";
import { logoutEmployee } from "../api/logoutEmployee";
import type { Employee, LoginPayload, Role } from "../types";

const TOKEN_KEY = "shipping_employee_token";

interface AuthContextValue {
  token: string | null;
  employee: Employee | null;
  role: Role | null;
  permissions: string[];
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

function storeToken(token: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(readToken()));

  useEffect(() => {
    const storedToken = readToken();
    if (!storedToken) return;

    let cancelled = false;

    (async () => {
      try {
        const me = await getCurrentEmployee(storedToken);
        if (!cancelled) {
          setEmployee(me.employee);
          setRole(me.role);
          setPermissions(me.permissions);
        }
      } catch {
        if (cancelled) return;
        clearToken();
        setToken(null);
        setEmployee(null);
        setRole(null);
        setPermissions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await loginEmployee(payload);
    storeToken(result.token);
    setToken(result.token);
    setEmployee(result.employee);
    setRole(result.role);
    setPermissions(result.permissions);
  }, []);

  const logout = useCallback(async () => {
    const currentToken = readToken();
    if (currentToken) {
      try {
        await logoutEmployee(currentToken);
      } catch {
        // ignore network errors on logout
      }
    }
    clearToken();
    setToken(null);
    setEmployee(null);
    setRole(null);
    setPermissions([]);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  const hasRole = useCallback(
    (roleName: string) => role?.name === roleName,
    [role]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ token, employee, role, permissions, loading, hasPermission, hasRole, login, logout }),
    [token, employee, role, permissions, loading, hasPermission, hasRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return context;
}