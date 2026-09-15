"use client";

import { useState } from "react";

interface VendorCategoryFormProps {
  initialName?: string;
  initialDescription?: string;
  onSubmit: (name: string, description: string) => Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function VendorCategoryForm({
  initialName = "",
  initialDescription = "",
  onSubmit,
  submitLabel,
  submittingLabel = "Saving...",
}: VendorCategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Category name is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), description.trim());
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
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. C&F Agent, Oversea Agent, Office Supplier"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 ${inputClass} ${errors.name ? "border-rose-300" : ""}`}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief description about this vendor category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`mt-1 ${inputClass} resize-y`}
          />
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
