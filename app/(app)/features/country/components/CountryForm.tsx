"use client";

import { useState } from "react";

interface CountryFormProps {
  initialCountryCode?: string;
  initialCountryName?: string;
  onSubmit: (countryCode: string, countryName: string) => Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function CountryForm({
  initialCountryCode = "",
  initialCountryName = "",
  onSubmit,
  submitLabel,
  submittingLabel = "Saving...",
}: CountryFormProps) {
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [countryName, setCountryName] = useState(initialCountryName);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!countryCode.trim()) nextErrors.countryCode = "Country code is required.";
    if (!countryName.trim()) nextErrors.countryName = "Country name is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(countryCode.trim().toUpperCase(), countryName.trim());
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

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Country Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. BD, IN, US"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            maxLength={10}
            className={`mt-1 ${inputClass} ${errors.countryCode ? "border-rose-300" : ""}`}
          />
          {errors.countryCode && <p className="mt-1 text-xs text-rose-600">{errors.countryCode}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Country Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Bangladesh, India, United States"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className={`mt-1 ${inputClass} ${errors.countryName ? "border-rose-300" : ""}`}
          />
          {errors.countryName && <p className="mt-1 text-xs text-rose-600">{errors.countryName}</p>}
        </div>
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
