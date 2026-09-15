"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../hooks/useAuth";

function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return <AuthSpinner />;
}

export function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Loading…</p>
    </div>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading, token } = useAuth();

  if (loading) {
    return <AuthSpinner />;
  }

  if (!token) {
    return <RedirectToLogin />;
  }

  return <>{children}</>;
}