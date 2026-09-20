"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { createRole, getPermissions, type PermissionsByModule } from "../api/roleApi";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

const MODULE_LABELS: Record<string, string> = {
  employee: "Employee",
  voyage: "Voyage",
  "bill-of-lading": "Bill of Lading",
  "container-manifest": "Container Manifest",
  invoice: "Invoice",
  "money-receipt": "Money Receipt",
  "ap-invoice": "AP Invoice",
  "ap-payment": "AP Payment",
  "journal-entry": "Journal Entry",
  "chart-of-account": "Chart of Accounts",
  "account-type": "Account Types",
  vendor: "Vendor",
  "vendor-category": "Vendor Category",
  country: "Country",
  currency: "Currency",
  uom: "UOM",
  item: "Item",
  reports: "Reports",
};

const ACTION_LABELS: Record<string, string> = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
  approve: "Approve",
  void: "Void",
};

export default function CreateRolePage() {
  const router = useRouter();
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<PermissionsByModule>({});
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    getPermissions(token ?? undefined)
      .then(setPermissions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function togglePermission(id: number) {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleModule(module: string, perms: Array<{ id: number }>) {
    const ids = perms.map((p) => p.id);
    const allSelected = ids.every((id) => selectedPermissions.has(id));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function toggleAll() {
    const allIds = Object.values(permissions)
      .flat()
      .map((p) => p.id);
    const allSelected = allIds.every((id) => selectedPermissions.has(id));
    setSelectedPermissions(allSelected ? new Set() : new Set(allIds));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Role name is required");
      return;
    }
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setSubmitting(true);
    try {
      await createRole(
        {
          name: name.trim(),
          display_name: displayName.trim(),
          description: description.trim() || undefined,
          permissions: Array.from(selectedPermissions),
        },
        token ?? undefined
      );
      router.push("/features/roles");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create role");
    } finally {
      setSubmitting(false);
    }
  }

  const allIds = Object.values(permissions).flat().map((p) => p.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedPermissions.has(id));

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Role Management
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Create New Role</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Define a new role and assign module-level permissions.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Role Name <span className="text-rose-500">*</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. data-entry"
                  className={inputClass}
                />
                <p className="text-xs text-slate-400">Unique identifier (lowercase, hyphens allowed)</p>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Display Name <span className="text-rose-500">*</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Data Entry Operator"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-700">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this role..."
                rows={2}
                className={`${inputClass} resize-y`}
              />
            </label>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-lg font-semibold text-slate-900">Permissions</h2>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </div>

              {loading ? (
                <p className="py-4 text-center text-sm text-slate-500">Loading permissions...</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(permissions).map(([module, perms]) => {
                    const moduleSelected = perms.every((p) => selectedPermissions.has(p.id));
                    const modulePartial = perms.some((p) => selectedPermissions.has(p.id)) && !moduleSelected;
                    return (
                      <div key={module} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={moduleSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = modulePartial;
                            }}
                            onChange={() => toggleModule(module, perms)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-sm font-semibold text-slate-900">
                            {MODULE_LABELS[module] || module}
                          </span>
                          <span className="text-xs text-slate-400">
                            {perms.filter((p) => selectedPermissions.has(p.id)).length}/{perms.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-7">
                          {perms.map((perm) => {
                            const action = perm.name.split(".")[1];
                            return (
                              <label
                                key={perm.id}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                  selectedPermissions.has(perm.id)
                                    ? "border-sky-300 bg-sky-50 text-sky-700"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.has(perm.id)}
                                  onChange={() => togglePermission(perm.id)}
                                  className="sr-only"
                                />
                                {ACTION_LABELS[action] || action}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/features/roles")}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Role"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
