"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDefaultApPaymentForm, DEFAULT_PAYMENT_METHODS, type ApPaymentFormData } from "../types";
import { saveApPayment } from "../api/saveApPayment";
import { lookupApInvoiceByNumber, getNextApPaymentNumber } from "../api/lookups";

export default function CreateApPaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState<ApPaymentFormData>(createDefaultApPaymentForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceErrors, setInvoiceErrors] = useState<Record<number, string | null>>({});

  useEffect(() => {
    getNextApPaymentNumber()
      .then((num) => setForm((prev) => ({ ...prev, apPaymentNumber: num })))
      .catch(() => {});
  }, []);

  function updateField(field: keyof ApPaymentFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addInvoiceLink() {
    setForm((prev) => ({
      ...prev,
      invoices: [...prev.invoices, { apInvoiceId: "", apInvoiceNumber: "", dueAmount: "", paidAmount: "" }],
    }));
  }

  function updateInvoiceLink(index: number, field: string, value: string) {
    setForm((prev) => {
      const invoices = [...prev.invoices];
      invoices[index] = { ...invoices[index], [field]: value };
      return { ...prev, invoices };
    });
  }

  function removeInvoiceLink(index: number) {
    setForm((prev) => ({ ...prev, invoices: prev.invoices.filter((_, i) => i !== index) }));
  }

  async function handleInvoiceNumberBlur(index: number) {
    const number = form.invoices[index].apInvoiceNumber.trim();
    if (!number) {
      setInvoiceErrors((prev) => ({ ...prev, [index]: null }));
      return;
    }
    try {
      const invoice = await lookupApInvoiceByNumber(number);
      setForm((prev) => {
        const invoices = [...prev.invoices];
        invoices[index] = {
          ...invoices[index],
          apInvoiceId: String(invoice.id),
          dueAmount: String(invoice.due_amount ?? "0"),
          paidAmount: String(invoice.due_amount ?? "0"),
        };
        return {
          ...prev,
          invoices,
          vendorId: String(invoice.vendor_id),
          vendorName: invoice.vendor?.vendor_name ?? "",
          amount: String(invoice.due_amount ?? "0"),
        };
      });
      setInvoiceErrors((prev) => ({ ...prev, [index]: null }));
    } catch {
      setInvoiceErrors((prev) => ({ ...prev, [index]: "Invoice not found" }));
      setForm((prev) => {
        const invoices = [...prev.invoices];
        invoices[index] = {
          ...invoices[index],
          apInvoiceId: "",
          dueAmount: "",
          paidAmount: "",
        };
        return { ...prev, invoices };
      });
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      await saveApPayment(form);
      router.push("/features/ap-payment/list");
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
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Payment</p>
            <h1 className="text-2xl font-semibold text-slate-900">Create AP Payment</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Record a payment made to a vendor. A draft journal entry will be created automatically.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Vendor Name</label>
              <input
                type="text"
                value={form.vendorName}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                placeholder="Auto-filled from invoice"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Payment Number</label>
              <input
                type="text"
                value={form.apPaymentNumber}
                onChange={(e) => updateField("apPaymentNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Payment Date</label>
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => updateField("paymentDate", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => updateField("paymentMethod", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {DEFAULT_PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Reference Number</label>
              <input
                type="text"
                value={form.referenceNumber}
                onChange={(e) => updateField("referenceNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Bank Account Number</label>
              <input
                type="text"
                value={form.bankAccountId}
                onChange={(e) => updateField("bankAccountId", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="20-digit bank account number"
                maxLength={20}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Invoice Allocations</h2>
              <button
                type="button"
                onClick={addInvoiceLink}
                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                + Add Allocation
              </button>
            </div>

            {form.invoices.length === 0 ? (
              <p className="text-xs text-slate-500">No invoice allocations added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">AP Invoice Number</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Due Amount</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Paid Amount</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {form.invoices.map((link, i) => (
                      <tr key={i}>
                        <td className="px-3 py-1">
                          <input
                            type="text"
                            value={link.apInvoiceNumber}
                            onChange={(e) => updateInvoiceLink(i, "apInvoiceNumber", e.target.value)}
                            onBlur={() => handleInvoiceNumberBlur(i)}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                            placeholder="e.g. API-2026-0001"
                          />
                          {invoiceErrors[i] && (
                            <p className="mt-0.5 text-[10px] text-rose-600">{invoiceErrors[i]}</p>
                          )}
                        </td>
                        <td className="px-3 py-1 text-right text-xs font-medium">
                          {link.dueAmount
                            ? (Number(link.dueAmount) - Number(link.paidAmount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })
                            : "-"}
                        </td>
                        <td className="px-3 py-1">
                          <input
                            type="number"
                            value={link.paidAmount}
                            onChange={(e) => updateInvoiceLink(i, "paidAmount", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        </td>
                        <td className="px-3 py-1">
                          <button
                            type="button"
                            onClick={() => removeInvoiceLink(i)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              {saving ? "Saving..." : "Save AP Payment"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
