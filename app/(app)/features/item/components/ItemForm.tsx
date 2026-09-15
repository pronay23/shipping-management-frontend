"use client";

import { useEffect, useState } from "react";
import type { Uom } from "../types";
import { getUomList } from "../api/getUomList";

interface ItemFormProps {
  initialData?: {
    item_code?: string;
    item_name?: string;
    item_type?: string;
    uom_id?: number | null;
    item_prices?: number;
    item_taxes?: number;
  };
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function ItemForm({
  initialData = {},
  onSubmit,
  submitLabel,
  submittingLabel = "Saving...",
}: ItemFormProps) {
  const [itemCode, setItemCode] = useState(initialData.item_code || "");
  const [itemName, setItemName] = useState(initialData.item_name || "");
  const [itemType, setItemType] = useState(initialData.item_type || "");
  const [uomId, setUomId] = useState<number | null>(initialData.uom_id ?? null);
  const [itemPrices, setItemPrices] = useState(initialData.item_prices ?? 0);
  const [itemTaxes, setItemTaxes] = useState(initialData.item_taxes ?? 0);

  const [uoms, setUoms] = useState<Uom[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUomList().then(setUoms);
  }, []);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!itemCode.trim()) nextErrors.item_code = "Item code is required.";
    if (!itemName.trim()) nextErrors.item_name = "Item name is required.";
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
        item_code: itemCode.trim(),
        item_name: itemName.trim(),
        item_type: itemType.trim() || null,
        uom_id: uomId,
        item_prices: itemPrices,
        item_taxes: itemTaxes,
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Item Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. ITM-0001"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            className={`mt-1 ${inputClass} ${errors.item_code ? "border-rose-300" : ""}`}
          />
          {errors.item_code && <p className="mt-1 text-xs text-rose-600">{errors.item_code}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Item Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Shipping Container Seal"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className={`mt-1 ${inputClass} ${errors.item_name ? "border-rose-300" : ""}`}
          />
          {errors.item_name && <p className="mt-1 text-xs text-rose-600">{errors.item_name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Item Type
          </label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">Select type</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="Consumable">Consumable</option>
            <option value="Fixed Asset">Fixed Asset</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Unit of Measure
          </label>
          <select
            value={uomId ?? ""}
            onChange={(e) => setUomId(e.target.value ? Number(e.target.value) : null)}
            className={`mt-1 ${inputClass}`}
          >
            <option value="">Select UOM</option>
            {uoms.map((uom) => (
              <option key={uom.id} value={uom.id}>
                {uom.uom_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Price (BDT)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={itemPrices}
            onChange={(e) => setItemPrices(parseFloat(e.target.value) || 0)}
            className={`mt-1 ${inputClass}`}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Tax (BDT)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={itemTaxes}
            onChange={(e) => setItemTaxes(parseFloat(e.target.value) || 0)}
            className={`mt-1 ${inputClass}`}
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
