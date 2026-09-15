"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "../../features/auth/hooks/useAuth";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!employeeId.trim() || !password) {
      setError("Employee ID and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ employee_id: employeeId.trim(), password });
      router.replace("/features/invoice");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img src="/bcl-logo.png" alt="Bangladesh Container Lines Ltd." className="h-16 w-auto" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Sign in</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Employee Login</h1>
        <p className="mt-2 text-sm text-slate-600">Use your employee ID and password to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="space-y-2 text-sm text-slate-700">
          Employee ID
          <input
            type="text"
            autoComplete="username"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </label>

        {error ? (
          <p className="whitespace-pre-line rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-sky-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}