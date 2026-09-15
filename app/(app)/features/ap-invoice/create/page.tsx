"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDefaultApInvoiceForm, createEmptyApInvoiceItem, type ApInvoiceFormData } from "../types";
import { saveApInvoice } from "../api/saveApInvoice";
import { lookupVendorByCode, lookupItemByCode, fetchAccountsList, getNextApInvoiceNumber } from "../api/lookups";
import { type AccountLookup } from "../api/lookups";

export default function CreateApInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState<ApInvoiceFormData>(createDefaultApInvoiceForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorError, setVendorError] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<Record<string, string | null>>({});
  const [accounts, setAccounts] = useState<AccountLookup[]>([]);

  useEffect(() => {
    getNextApInvoiceNumber()
      .then((num) => setForm((prev) => ({ ...prev, apInvoiceNumber: num })))
      .catch(() => {});
    fetchAccountsList()
      .then(setAccounts)
      .catch(() => {});
  }, []);

  function updateField(field: keyof ApInvoiceFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleVendorCodeBlur() {
    const code = form.vendorCode.trim();
    if (!code) {
      setVendorError(null);
      return;
    }
    try {
      const vendor = await lookupVendorByCode(code);
      setForm((prev) => ({
        ...prev,
        vendorId: String(vendor.id),
        vendorName: vendor.vendor_name ?? "",
      }));
      setVendorError(null);
    } catch {
      setForm((prev) => ({ ...prev, vendorId: "", vendorName: "" }));
      setVendorError("Vendor not found");
    }
  }

  function updateItem(index: number, field: string, value: string) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        const qty = Number(items[index].quantity) || 0;
        const price = Number(items[index].unitPrice) || 0;
        items[index].totalBdt = String(qty * price);
      }
      if (field === "accountId") {
        const match = accounts.find((a) => String(a.id) === String(value));
        items[index].accountName = match?.name ?? "";
      }
      return { ...prev, items };
    });
  }

  async function handleItemCodeBlur(index: number) {
    const code = form.items[index].itemCode.trim();
    if (!code) {
      setItemErrors((prev) => ({ ...prev, [form.items[index].key]: null }));
      return;
    }
    try {
      const item = await lookupItemByCode(code);
      setForm((prev) => {
        const items = [...prev.items];
        items[index] = {
          ...items[index],
          description: item.item_name ?? items[index].description,
        };
        return { ...prev, items };
      });
      setItemErrors((prev) => ({ ...prev, [form.items[index].key]: null }));
    } catch {
      setItemErrors((prev) => ({ ...prev, [form.items[index].key]: "Item not found" }));
    }
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, createEmptyApInvoiceItem()] }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }

  const totalBdt = form.items.reduce((sum, item) => sum + (Number(item.totalBdt) || 0), 0);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      await saveApInvoice(form);
      router.push("/features/ap-invoice/list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Invoice</p>
            <h1 className="text-2xl font-semibold text-slate-900">Create AP Invoice</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Record a vendor invoice. A draft journal entry will be created automatically.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Vendor Code</label>
              <input
                type="text"
                value={form.vendorCode}
                onChange={(e) => updateField("vendorCode", e.target.value)}
                onBlur={handleVendorCodeBlur}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. VND-0001"
              />
              {vendorError && <p className="mt-1 text-xs text-rose-600">{vendorError}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Vendor Name</label>
              <input
                type="text"
                value={form.vendorName}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                placeholder="Auto-filled from vendor code"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Invoice Number</label>
              <input
                type="text"
                value={form.apInvoiceNumber}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Invoice Date</label>
              <input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => updateField("invoiceDate", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Reference</label>
              <input
                type="text"
                value={form.reference}
                onChange={(e) => updateField("reference", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Line Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                + Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Item Code</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Description</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Account ID</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Unit Price</th>
                    <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Total</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {form.items.map((item, i) => (
                    <tr key={item.key}>
                      <td className="px-3 py-1">
                        <input
                          type="text"
                          value={item.itemCode}
                          onChange={(e) => updateItem(i, "itemCode", e.target.value)}
                          onBlur={() => handleItemCodeBlur(i)}
                          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                          placeholder="e.g. ITM-0001"
                        />
                        {itemErrors[item.key] && (
                          <p className="mt-0.5 text-[10px] text-rose-600">{itemErrors[item.key]}</p>
                        )}
                      </td>
                      <td className="px-3 py-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-3 py-1">
                        <select
                          value={item.accountId}
                          onChange={(e) => updateItem(i, "accountId", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="">Select Account</option>
                          {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, "quantity", e.target.value)}
                          className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-right text-xs"
                        />
                      </td>
                      <td className="px-3 py-1">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                          className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-right text-xs"
                        />
                      </td>
                      <td className="px-3 py-1 text-right text-xs font-medium">
                        {Number(item.totalBdt).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-1">
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-semibold text-slate-900">
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-right uppercase tracking-wide">Total</td>
                    <td className="px-3 py-2 text-right">
                      {totalBdt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save AP Invoice"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
