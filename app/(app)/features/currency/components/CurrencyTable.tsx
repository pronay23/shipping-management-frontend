"use client";

import { useEffect, useState } from "react";
import type { Currency } from "../types";
import { getCurrencyList } from "../api/getCurrencyList";
import { updateCurrency } from "../api/updateCurrency";
import { deleteCurrency } from "../api/deleteCurrency";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function CurrencyTable() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [editCurrencyCode, setEditCurrencyCode] = useState("");
  const [editCurrencyName, setEditCurrencyName] = useState("");
  const [editSymbol, setEditSymbol] = useState("");
  const [editExchangeRate, setEditExchangeRate] = useState(1);
  const [editIsBaseCurrency, setEditIsBaseCurrency] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  async function fetchCurrencies() {
    setLoading(true);
    try {
      const data = await getCurrencyList();
      setCurrencies(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load currencies");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(currency: Currency) {
    setEditingCurrency(currency);
    setEditCurrencyCode(currency.currency_code);
    setEditCurrencyName(currency.currency_name);
    setEditSymbol(currency.symbol);
    setEditExchangeRate(currency.exchange_rate);
    setEditIsBaseCurrency(currency.is_base_currency);
    setEditIsActive(currency.is_active);
    setSaveError(null);
    setEditModalOpen(true);
  }

  async function handleUpdate() {
    if (!editingCurrency) return;
    if (!editCurrencyCode.trim() || !editCurrencyName.trim() || !editSymbol.trim()) {
      setSaveError("All fields are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateCurrency(editingCurrency.id, {
        currency_code: editCurrencyCode.trim().toUpperCase(),
        currency_name: editCurrencyName.trim(),
        symbol: editSymbol.trim(),
        exchange_rate: editExchangeRate,
        is_base_currency: editIsBaseCurrency,
        is_active: editIsActive,
      });
      setSuccessMsg("Currency updated successfully!");
      await fetchCurrencies();
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update currency");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(currency: Currency) {
    if (!confirm(`Are you sure you want to delete "${currency.currency_name}"?`)) return;
    try {
      await deleteCurrency(currency.id);
      setSuccessMsg("Currency deleted successfully!");
      await fetchCurrencies();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete currency");
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">Loading currencies...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
        {error}
      </div>
    );
  }

  if (currencies.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No currencies found.{" "}
        <a href="/features/currency/create" className="font-medium text-sky-600 hover:underline">
          Add a currency
        </a>
      </div>
    );
  }

  return (
    <>
      {successMsg && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Code</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Symbol</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Exchange Rate</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Base</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Active</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {currencies.map((currency) => (
              <tr key={currency.id} className="hover:bg-slate-50 transition">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                  {currency.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-slate-900">
                  {currency.currency_code}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{currency.currency_name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-lg">{currency.symbol}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-slate-600">
                  {currency.exchange_rate}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {currency.is_base_currency ? (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Base
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {currency.is_active ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(currency)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                      title="Edit Currency"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(currency)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Currency"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && editingCurrency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Currency</h2>
                <p className="text-sm text-slate-500">ID: {editingCurrency.id}</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {saveError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
                {saveError}
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Currency Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCurrencyCode}
                  onChange={(e) => setEditCurrencyCode(e.target.value)}
                  maxLength={10}
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Currency Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCurrencyName}
                  onChange={(e) => setEditCurrencyName(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Symbol <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editSymbol}
                  onChange={(e) => setEditSymbol(e.target.value)}
                  maxLength={10}
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Exchange Rate <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={editExchangeRate}
                  onChange={(e) => setEditExchangeRate(parseFloat(e.target.value) || 0)}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
            </div>

            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editIsBaseCurrency}
                  onChange={(e) => setEditIsBaseCurrency(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Base Currency
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
