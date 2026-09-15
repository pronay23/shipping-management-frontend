"use client";

import { useEffect, useState } from "react";

interface AccountTypeItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  account_type_id: number | null;
  parent_id: number | null;
  is_active: boolean;
  is_system: boolean;
  parent?: {
    id: number;
    code: string;
    name: string;
  } | null;
  account_type?: {
    id: number;
    slug: string;
    name: string;
  } | null;
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    account_type_id: "",
    parent_id: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAccountTypes = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/account-types");
      if (res.ok) {
        const json = await res.json();
        setAccountTypes(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load account types", err);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterType) params.append("type", filterType);

      const res = await fetch(`http://127.0.0.1:8000/api/chart-of-accounts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load chart of accounts");

      const json = await res.json();
      setAccounts(json.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [search, filterType]);

  const handleOpenCreateModal = () => {
    setEditingAccount(null);
    setFormData({
      code: "",
      name: "",
      account_type_id: accountTypes.length > 0 ? String(accountTypes[0].id) : "",
      parent_id: "",
      is_active: true,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      code: account.code,
      name: account.name,
      account_type_id: account.account_type_id
        ? String(account.account_type_id)
        : accountTypes.find((t) => t.slug === account.type)?.id
        ? String(accountTypes.find((t) => t.slug === account.type)?.id)
        : "",
      parent_id: account.parent_id ? String(account.parent_id) : "",
      is_active: account.is_active,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    const selectedType = accountTypes.find((t) => String(t.id) === formData.account_type_id);

    const payload = {
      code: formData.code,
      name: formData.name,
      account_type_id: formData.account_type_id ? Number(formData.account_type_id) : null,
      type: selectedType?.slug || null,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
      is_active: formData.is_active,
    };

    const isEdit = !!editingAccount;
    const url = isEdit
      ? `http://127.0.0.1:8000/api/chart-of-accounts/${editingAccount.id}`
      : "http://127.0.0.1:8000/api/chart-of-accounts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || Object.values(json.errors || {}).flat().join(", ") || "Save failed.");
      }

      setSuccessMsg(isEdit ? "Account updated successfully!" : "Account created successfully!");
      setIsModalOpen(false);
      fetchAccounts();

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (account: Account) => {
    if (account.is_system) {
      alert("System accounts cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete account "${account.code} - ${account.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/chart-of-accounts/${account.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to delete account");
      }

      setSuccessMsg("Account deleted successfully!");
      fetchAccounts();
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
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Accounting</p>
              <h1 className="text-2xl font-semibold text-slate-900">Chart of Accounts</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage general ledger accounts, system control codes, and financial categories.
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
                Add Account
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

          {/* Filters & Search */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by code or account name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">All Account Types</option>
                {accountTypes.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading chart of accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No chart of accounts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Account Code</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Account Name</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Parent Account</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">System</th>
                    <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {accounts.map((account) => {
                    const typeName = account.account_type?.name || account.type;
                    return (
                      <tr key={account.id} className="hover:bg-slate-50 transition">
                        <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-900">
                          {account.code}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">{account.name}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800 uppercase">
                            {typeName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {account.parent ? `${account.parent.code} - ${account.parent.name}` : "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          {account.is_active ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          {account.is_system ? (
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                              System
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(account)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                              title="Edit Account"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {!account.is_system && (
                              <button
                                onClick={() => handleDelete(account)}
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                title="Delete Account"
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingAccount ? "Edit Chart of Account" : "Add New Chart of Account"}
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
                  Account Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1030 or 4009"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Account Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Petty Cash or Freight Revenue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Account Type <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.account_type_id}
                  onChange={(e) => setFormData({ ...formData, account_type_id: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">Select Account Type</option>
                  {accountTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Parent Account (Optional)
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">None (Top Level)</option>
                  {accounts
                    .filter((a) => !editingAccount || a.id !== editingAccount.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code} - {a.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Account is active
                </label>
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
                  {submitting ? "Saving..." : editingAccount ? "Update Account" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
