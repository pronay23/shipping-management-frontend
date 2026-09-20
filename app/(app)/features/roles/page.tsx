"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { getRoles, deleteRole, type Role } from "./api/roleApi";

export default function RoleListPage() {
  const { token } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchRoles();
  }, [token]);

  async function fetchRoles() {
    setLoading(true);
    try {
      const data = await getRoles(token ?? undefined);
      setRoles(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete role "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteRole(id, token ?? undefined);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete role");
    } finally {
      setDeleting(null);
    }
  }

  const SYSTEM_ROLES = ["super-admin", "admin", "manager"];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                Role Management
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Create and manage roles. Assign granular module permissions to each role.
              </p>
            </div>
            <Link
              href="/features/roles/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Role
            </Link>
          </div>

          {loading && (
            <div className="py-12 text-center text-sm text-slate-500">Loading roles...</div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {error}
            </div>
          )}

          {!loading && !error && roles.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">
              No roles found.{" "}
              <Link href="/features/roles/create" className="font-medium text-sky-600 hover:underline">
                Create a role
              </Link>
            </div>
          )}

          {!loading && !error && roles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Display Name</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Description</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Permissions</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {roles.map((role) => {
                    const isSystem = SYSTEM_ROLES.includes(role.name);
                    return (
                      <tr key={role.id} className="hover:bg-slate-50 transition">
                        <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-900">
                          {role.name}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {role.display_name || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {role.description || "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                            {role.permissions?.length ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isSystem ? (
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                              System
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Custom
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/features/roles/${role.id}/edit`}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                              title="Edit Role"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            {!isSystem && (
                              <button
                                type="button"
                                onClick={() => handleDelete(role.id, role.name)}
                                disabled={deleting === role.id}
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50"
                                title="Delete Role"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
