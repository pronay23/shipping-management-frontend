"use client";

import { useEffect, useState } from "react";

export interface AccountTypeItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  is_system: boolean;
  accounts_count?: number;
}

export default function AccountTypesPage() {
  const [types, setTypes] = useState<AccountTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<AccountTypeItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/account-types");
      if (!res.ok) throw new Error("Failed to load account types");

      const json = await res.json();
      setTypes(json.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingType(null);
    setFormData({
      name: "",
      description: "",
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AccountTypeItem) => {
    setEditingType(item);
    setFormData({
      name: item.name,
      description: item.description || "",
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    const isEdit = !!editingType;
    const url = isEdit
      ? `http://127.0.0.1:8000/api/account-types/${editingType.id}`
      : "http://127.0.0.1:8000/api/account-types";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Object.values(json.errors || {}).flat().join(", ") || "Save failed.");
      }

      setSuccessMsg(isEdit ? "Account type updated successfully!" : "Account type created successfully!");
      setIsModalOpen(false);
      fetchTypes();

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: AccountTypeItem) => {
    if (item.is_system) {
      alert("System account types cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete account type "${item.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/account-types/${item.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to delete account type");
      }

      setSuccessMsg("Account type deleted successfully!");
      fetchTypes();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Accounting Settings</p>
              <h1 className="text-2xl font-semibold text-slate-900">Account Types</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage financial categories (e.g. Asset, Liability, Equity, Revenue, Expense, or custom categories).
              </p>
            </div>
            <div>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Account Type
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading account types...</div>
          ) : types.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No account types found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">ID / Slug</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Type Name</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Description</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Assigned Accounts</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">System Default</th>
                    <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {types.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                        {item.slug}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-center font-medium text-slate-800">
                        {item.accounts_count ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center">
                        {item.is_system ? (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                            System
                          </span>
                        ) : (
                          <span className="text-slate-400">Custom</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                            title="Edit Type"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {!item.is_system && (
                            <button
                              onClick={() => handleDelete(item)}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              title="Delete Type"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingType ? "Edit Account Type" : "Add New Account Type"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Account Type Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Current Asset or Cost of Goods Sold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description explaining what accounts belong in this type..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingType ? "Update Type" : "Create Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
