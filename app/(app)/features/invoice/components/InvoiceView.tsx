"use client";

import Link from "next/link";

import { useInvoicePdf } from "../hooks/useInvoicePdf";
import { calculateTotals } from "../lib/invoice";
import type { InvoiceFormData } from "../types";
import { InvoicePreview } from "./InvoicePreview";
import { InvoiceStatus } from "./InvoiceStatus";
import { InvoiceSummary } from "./InvoiceSummary";

interface InvoiceViewProps {
  data: InvoiceFormData;
}

export function InvoiceView({ data }: InvoiceViewProps) {
  const { previewRef, isGenerating, generatePdf } = useInvoicePdf();
  const totals = calculateTotals(data.items, data.exRate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InvoiceStatus>Saved</InvoiceStatus>
        <div className="flex items-center gap-3">
          <Link
            href="/features/invoice/list"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to list
          </Link>
          <button
            type="button"
            onClick={() => generatePdf(`Invoice-${data.invoiceNumber || "document"}.pdf`)}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Invoice Preview</p>
        <div className="overflow-x-auto">
          <InvoicePreview ref={previewRef} data={data} />
        </div>
      </div>

      <InvoiceSummary totalUsd={totals.totalUsd} totalBdt={totals.totalBdt} exRate={data.exRate} />
    </div>
  );
}