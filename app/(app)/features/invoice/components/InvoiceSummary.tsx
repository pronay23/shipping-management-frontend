import { formatCurrency } from "../lib/invoice";

interface InvoiceSummaryProps {
  totalUsd: number;
  totalBdt: number;
  exRate: string;
}

export function InvoiceSummary({ totalUsd, totalBdt, exRate }: InvoiceSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
      <div className="mt-4 space-y-3 text-slate-700">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>Total USD</span>
          <span className="font-semibold text-slate-900">{formatCurrency(totalUsd)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>Exchange rate</span>
          <span className="font-semibold text-slate-900">{exRate}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>Total BDT</span>
          <span className="font-semibold text-slate-900">{formatCurrency(totalBdt)}</span>
        </div>
      </div>
    </section>
  );
}