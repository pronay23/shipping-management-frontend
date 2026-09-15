import { formatCurrency } from "../../invoice/lib/invoice";

interface MoneyReceiptSummaryProps {
  totalUsd: number;
  totalBdt: number;
  paidTotal: number;
  exRate: string;
}

export function MoneyReceiptSummary({ totalUsd, totalBdt, paidTotal, exRate }: MoneyReceiptSummaryProps) {
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
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
          <span className="font-semibold text-emerald-800">Total Received (BDT)</span>
          <span className="font-semibold text-emerald-800">{formatCurrency(paidTotal)}</span>
        </div>
      </div>
    </section>
  );
}