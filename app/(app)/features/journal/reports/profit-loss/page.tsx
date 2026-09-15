import { Suspense } from "react";
import Link from "next/link";

import { getProfitAndLoss } from "../../api/getProfitAndLoss";
import type { ProfitAndLossRow } from "../../types";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";
import PeriodSelector from "./PeriodSelector";

interface ProfitAndLossPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function formatAmount(value: string | number | null): string {
  return value != null ? formatCurrency(parseNumber(String(value))) : "—";
}

interface SectionTableProps {
  title: string;
  rows: ProfitAndLossRow[];
}

function SectionTable({ title, rows }: SectionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th colSpan={2} className="px-3 py-2 text-left font-semibold uppercase tracking-wide">
              {title}
            </th>
            <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Amount</th>
          </tr>
          <tr className="bg-white">
            <th className="whitespace-nowrap px-3 py-1.5 text-left font-medium text-slate-400">Code</th>
            <th className="px-3 py-1.5 text-left font-medium text-slate-400">Account</th>
            <th className="px-3 py-1.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-3 py-3 text-sm text-slate-500">
                No accounts in this section.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row.account_id)} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-3 py-2">{singleLine(row.account_code) || "—"}</td>
                <td className="px-3 py-2">{singleLine(row.account_name) || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">{formatAmount(row.amount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function ProfitAndLossPage({ searchParams }: ProfitAndLossPageProps) {
  const { from, to } = await searchParams;

  let report: Awaited<ReturnType<typeof getProfitAndLoss>> | null = null;
  let errorMessage: string | null = null;

  try {
    report = await getProfitAndLoss(from, to);
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  let periodLabel = "All time";
  if (from && to) {
    const f = new Date(from);
    const t = new Date(to);
    if (f.getFullYear() === t.getFullYear() && f.getMonth() === t.getMonth()) {
      periodLabel = `${monthNames[f.getMonth()]} ${f.getFullYear()}`;
    } else if (f.getFullYear() === t.getFullYear() && f.getMonth() === 0 && t.getMonth() === 11) {
      periodLabel = `${f.getFullYear()}`;
    } else {
      periodLabel = `${from} → ${to}`;
    }
  }

  const netProfit = report?.totals.net_profit != null ? parseNumber(String(report.totals.net_profit)) : null;
  const isLoss = netProfit != null && netProfit < 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">Profit &amp; loss</h1>
              <p className="mt-1 text-sm text-slate-500">
                Period: {periodLabel}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Revenue and expense movement derived live from posted journal entries. Voided vouchers and their
                reversals net out to zero.
              </p>
            </div>
            <Link
              href="/features/journal/reports/trial-balance"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Trial balance
            </Link>
          </div>

          <div className="mb-6">
            <Suspense fallback={null}>
              <PeriodSelector />
            </Suspense>
          </div>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </p>
          ) : !report ? (
            <p className="text-sm text-slate-500">No profit &amp; loss data available.</p>
          ) : (
            <div className="space-y-6">
              <SectionTable title="Revenue" rows={report.revenue} />
              <SectionTable title="Expenses" rows={report.expenses} />

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">
                        Total revenue
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                        {formatAmount(report.totals.total_revenue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">
                        Total expenses
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                        {formatAmount(report.totals.total_expense)}
                      </td>
                    </tr>
                    <tr className={`font-semibold ${isLoss ? "text-rose-700" : "text-emerald-700"}`}>
                      <td className="bg-slate-50 px-3 py-2 text-sm uppercase tracking-wide">
                        {isLoss ? "Net loss" : "Net profit"}
                      </td>
                      <td className="whitespace-nowrap bg-slate-50 px-3 py-2 text-right text-sm">
                        {netProfit != null ? formatCurrency(netProfit) : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
