"use client";

import { useState } from "react";

import { saveInvoice } from "../api/saveInvoice";
import { useInvoiceForm } from "../hooks/useInvoiceForm";
import { useInvoicePdf } from "../hooks/useInvoicePdf";
import { buildInvoicePayload } from "../lib/invoice";
import { errorsToRecord, validateInvoice } from "../validation/invoice";
import { getBillOfLadingByNumber } from "../../bill-of-lading/api/getBillOfLadingByNumber";
import { InvoiceBankDetails } from "./InvoiceBankDetails";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { InvoicePreview } from "./InvoicePreview";
import { InvoiceSummary } from "./InvoiceSummary";
import type { InvoiceFormData } from "../types";

interface InvoiceBuilderProps {
  initialData?: InvoiceFormData;
}

export function InvoiceBuilder({ initialData }: InvoiceBuilderProps) {
  const { form, totals, updateField, updateBankField, updateItem, addItem, removeItem, reset } =
    useInvoiceForm(initialData);
  const { previewRef, isGenerating, generatePdf } = useInvoicePdf();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleInvalid() {
    const validationErrors = validateInvoice(form);
    if (validationErrors.length === 0) return false;
    setErrors(errorsToRecord(validationErrors));
    alert(validationErrors[0].message);
    return true;
  }

  async function handleSave() {
    if (isSaving || handleInvalid()) return;
    setErrors({});
    setIsSaving(true);
    try {
      const result = await saveInvoice(buildInvoicePayload(form));
      alert("Invoice saved successfully.");
      console.log("Invoice saved:", result.data);
      reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Invoice save failed:", error);
      alert(`Unable to save invoice:\n${message}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePdf() {
    if (handleInvalid()) return;
    setErrors({});
    await generatePdf(`Invoice-${form.invoiceNumber || "document"}.pdf`);
  }

  async function handleBlNumberLookup(blNumber: string) {
    const normalized = blNumber.trim();
    if (!normalized) return;
    try {
      const bill = await getBillOfLadingByNumber(normalized);
      if (!bill) return;
      updateField("vessel", bill.vessel_name ?? "");
      updateField("voyage", bill.vessel_number ?? "");
      updateField("registrationNo", bill.registration ?? "");
      const billType = (bill.bill_type ?? "").toLowerCase();
      const isImport = billType === "import";
      updateField("customerName", isImport ? (bill.notify_party ?? "") : (bill.booking_party ?? ""));
    } catch (error) {
      console.error("B/L lookup failed:", error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/bcl-logo.png" alt="Bangladesh Container Lines Ltd." className="h-16 w-auto" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Invoice</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Import shipment invoice</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Fill in the details below, then click Generate PDF to download the formatted invoice.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Invoice"}
            </button>
            <button
              type="button"
              onClick={handlePdf}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <InvoiceForm form={form} errors={errors} onFieldChange={updateField} onBlNumberLookup={handleBlNumberLookup} />
          <InvoiceItemsTable
            items={form.items}
            exRate={form.exRate}
            onItemChange={updateItem}
            onAdd={addItem}
            onRemove={removeItem}
          />
        </div>

        <aside className="space-y-6">
          <InvoiceBankDetails bankDetails={form.bankDetails} onBankFieldChange={updateBankField} />
          <InvoiceSummary totalUsd={totals.totalUsd} totalBdt={totals.totalBdt} exRate={form.exRate} />
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Invoice preview</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The formatted preview below is exactly what will be exported as PDF.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Invoice Preview</p>
        <InvoicePreview ref={previewRef} data={form} />
      </div>
    </div>
  );
}