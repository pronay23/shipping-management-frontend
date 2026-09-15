"use client";

import { useState } from "react";

interface CurrencyFormProps {
  initialCurrencyCode?: string;
  initialCurrencyName?: string;
  initialSymbol?: string;
  initialExchangeRate?: number;
  initialIsBaseCurrency?: boolean;
  initialIsActive?: boolean;
  onSubmit: (payload: {
    currency_code: string;
    currency_name: string;
    symbol: string;
    exchange_rate: number;
    is_base_currency: boolean;
    is_active: boolean;
  }) => Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function CurrencyForm({
  initialCurrencyCode = "",
  initialCurrencyName = "",
  initialSymbol = "",
  initialExchangeRate = 1,
  initialIsBaseCurrency = false,
  initialIsActive = true,
  onSubmit,
  submitLabel,
  submittingLabel = "Saving...",
}: CurrencyFormProps) {
  const [currencyCode, setCurrencyCode] = useState(initialCurrencyCode);
  const [currencyName, setCurrencyName] = useState(initialCurrencyName);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [exchangeRate, setExchangeRate] = useState(initialExchangeRate);
  const [isBaseCurrency, setIsBaseCurrency] = useState(initialIsBaseCurrency);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!currencyCode.trim()) nextErrors.currencyCode = "Currency code is required.";
    if (!currencyName.trim()) nextErrors.currencyName = "Currency name is required.";
    if (!symbol.trim()) nextErrors.symbol = "Symbol is required.";
    if (exchangeRate < 0) nextErrors.exchangeRate = "Exchange rate must be positive.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        currency_code: currencyCode.trim().toUpperCase(),
        currency_name: currencyName.trim(),
        symbol: symbol.trim(),
        exchange_rate: exchangeRate,
        is_base_currency: isBaseCurrency,
        is_active: isActive,
      });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
          {formError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Currency Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. USD, BDT, EUR"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            maxLength={10}
            className={`mt-1 ${inputClass} ${errors.currencyCode ? "border-rose-300" : ""}`}
          />
          {errors.currencyCode && <p className="mt-1 text-xs text-rose-600">{errors.currencyCode}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Currency Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. US Dollar, Bangladeshi Taka"
            value={currencyName}
            onChange={(e) => setCurrencyName(e.target.value)}
            className={`mt-1 ${inputClass} ${errors.currencyName ? "border-rose-300" : ""}`}
          />
          {errors.currencyName && <p className="mt-1 text-xs text-rose-600">{errors.currencyName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Symbol <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. $, €, ৳"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            maxLength={10}
            className={`mt-1 ${inputClass} ${errors.symbol ? "border-rose-300" : ""}`}
          />
          {errors.symbol && <p className="mt-1 text-xs text-rose-600">{errors.symbol}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Exchange Rate (vs Base) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            min="0"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
            className={`mt-1 ${inputClass} ${errors.exchangeRate ? "border-rose-300" : ""}`}
          />
          {errors.exchangeRate && <p className="mt-1 text-xs text-rose-600">{errors.exchangeRate}</p>}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isBaseCurrency}
            onChange={(e) => setIsBaseCurrency(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          Base Currency
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          Active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
