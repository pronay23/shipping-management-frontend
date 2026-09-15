"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { saveMoneyReceipt } from "../api/saveMoneyReceipt";
import { useMoneyReceiptForm } from "../hooks/useMoneyReceiptForm";
import { buildMoneyReceiptForm, buildMoneyReceiptPayload, calculatePaidTotal } from "../lib/money-receipt";
import { errorsToRecord, validateMoneyReceipt } from "../validation/money-receipt";
import { useInvoicePdf } from "../../invoice/hooks/useInvoicePdf";
import type { InvoiceDetail } from "../../invoice/types";
import { MoneyReceiptForm } from "./MoneyReceiptForm";
import { MoneyReceiptItemsTable } from "./MoneyReceiptItemsTable";
import { MoneyReceiptInvoicesTable } from "./MoneyReceiptInvoicesTable";
import { MoneyReceiptSummary } from "./MoneyReceiptSummary";
import { MoneyReceiptPreview } from "./MoneyReceiptPreview";

interface MoneyReceiptProps {
  invoices: InvoiceDetail[];
  receivedByInvoice?: Record<string, number>;
  initialPaymentTerm?: string;
}

export function MoneyReceipt({ invoices, receivedByInvoice, initialPaymentTerm }: MoneyReceiptProps) {
  const router = useRouter();
  const initialData = useMemo(
    () => buildMoneyReceiptForm(invoices, receivedByInvoice, initialPaymentTerm),
    [invoices, receivedByInvoice, initialPaymentTerm]
  );
  const { form, totals, updateField, updateItem, updateInvoicePaid } = useMoneyReceiptForm(initialData);
  const { previewRef, isGenerating, generatePdf } = useInvoicePdf();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paidTotal = calculatePaidTotal(form);

  function handleInvalid() {
    const validationErrors = validateMoneyReceipt(form);
    if (validationErrors.length === 0) return false;
    setErrors(errorsToRecord(validationErrors));
    alert(validationErrors[0].message);
    return true;
  }

  async function handleSave() {
    if (isSaving || saved || handleInvalid()) return;
    setErrors({});
    setIsSaving(true);
    try {
      const result = await saveMoneyReceipt(buildMoneyReceiptPayload(form));
      setSaved(true);
      console.log("Money receipt saved:", result.data);
      router.push("/features/money-receipt/list");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Money receipt save failed:", error);
      alert(`Unable to save money receipt:\n${message}`);
      setIsSaving(false);
    }
  }

  async function handlePdf() {
    if (handleInvalid()) return;
    setErrors({});
    await generatePdf(`Money-Receipt-${form.moneyReceiptNumber.replaceAll("/", "-")}.pdf`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/features/invoice/list"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to list
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || saved}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {saved ? "Saved" : isSaving ? "Saving..." : "Save Receipt"}
          </button>
          <button
            type="button"
            onClick={handlePdf}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <MoneyReceiptForm form={form} errors={errors} onFieldChange={updateField} />
          <MoneyReceiptItemsTable items={form.items} exRate={form.exRate} onItemChange={updateItem} />
          <MoneyReceiptInvoicesTable invoices={form.invoices} onPaidChange={updateInvoicePaid} />
        </div>

        <aside className="space-y-6">
          <MoneyReceiptSummary
            totalUsd={totals.totalUsd}
            totalBdt={totals.totalBdt}
            paidTotal={paidTotal}
            exRate={form.exRate}
          />
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Receipt preview</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The formatted preview below is exactly what will be exported as PDF.
            </p>
          </div>
        </aside>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Money Receipt Preview</p>
        <MoneyReceiptPreview ref={previewRef} data={form} />
      </div>
    </div>
  );
}