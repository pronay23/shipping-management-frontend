"use client";

import Link from "next/link";

import { useInvoicePdf } from "../../invoice/hooks/useInvoicePdf";
import { calculateMoneyReceiptTotals, calculatePaidTotal } from "../lib/money-receipt";
import type { MoneyReceiptFormData } from "../types";
import { MoneyReceiptPreview } from "./MoneyReceiptPreview";
import { MoneyReceiptSummary } from "./MoneyReceiptSummary";

interface MoneyReceiptViewProps {
  data: MoneyReceiptFormData;
}

export function MoneyReceiptView({ data }: MoneyReceiptViewProps) {
  const { previewRef, isGenerating, generatePdf } = useInvoicePdf();
  const totals = calculateMoneyReceiptTotals(data);
  const paidTotal = calculatePaidTotal(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Saved
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/features/money-receipt/list"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to list
          </Link>
          <button
            type="button"
            onClick={() => generatePdf(`Money-Receipt-${data.moneyReceiptNumber.replaceAll("/", "-") || "document"}.pdf`)}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Receipt Preview</p>
          <div className="overflow-x-auto">
            <MoneyReceiptPreview ref={previewRef} data={data} />
          </div>
        </div>
        <div>
          <MoneyReceiptSummary
            totalUsd={totals.totalUsd}
            totalBdt={totals.totalBdt}
            paidTotal={paidTotal}
            exRate={data.exRate}
          />
        </div>
      </div>
    </div>
  );
}
