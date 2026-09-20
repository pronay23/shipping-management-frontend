"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getBalanceSheet } from "../../journal/api/getBalanceSheet";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";
import type { BalanceSheetReport } from "../../journal/api/getBalanceSheet";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function formatAmount(value: string | number | null): string {
  return value != null ? formatCurrency(parseNumber(String(value))) : "\u2014";
}

interface SectionTableProps {
  title: string;
  rows: Array<{ account_id: string | number; account_code: string | null; account_name: string | null; balance: string | number | null }>;
}

function SectionTable({ title, rows }: SectionTableProps) {
  const total = rows.reduce((sum, r) => sum + parseNumber(String(r.balance ?? 0)), 0);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th colSpan={2} className="px-3 py-2 text-left font-semibold uppercase tracking-wide">{title}</th>
            <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Balance</th>
          </tr>
          <tr className="bg-white">
            <th className="whitespace-nowrap px-3 py-1.5 text-left font-medium text-slate-400">Code</th>
            <th className="px-3 py-1.5 text-left font-medium text-slate-400">Account</th>
            <th className="px-3 py-1.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {rows.length === 0 ? (
            <tr><td colSpan={3} className="px-3 py-3 text-sm text-slate-500">No accounts in this section.</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={String(row.account_id)} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-3 py-2">{singleLine(row.account_code) || "\u2014"}</td>
                <td className="px-3 py-2">{singleLine(row.account_name) || "\u2014"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">{formatAmount(row.balance)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold">
          <tr>
            <td colSpan={2} className="px-3 py-2 text-right uppercase tracking-wide text-slate-500">Total {title}</td>
            <td className="whitespace-nowrap px-3 py-2 text-right">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function BalanceSheetPage() {
  const searchParams = useSearchParams();
  const as_of = searchParams.get("as_of") ?? undefined;
  const { token } = useAuth();
  const [report, setReport] = useState<BalanceSheetReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getBalanceSheet(as_of, token);
        if (!cancelled) {
          setReport(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, as_of]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">Balance Sheet</h1>
              <p className="mt-1 text-sm text-slate-500">As of: {report?.meta.as_of ?? "today"}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Assets, liabilities, and equity derived from posted journal entries.
              </p>
            </div>
            <Link
              href="/features/journal/reports/trial-balance"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Trial balance
            </Link>
          </div>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
          ) : !report ? (
            <p className="text-sm text-slate-500">No balance sheet data available.</p>
          ) : (
            <div className="space-y-6">
              <SectionTable title="Assets" rows={report.assets} />
              <SectionTable title="Liabilities" rows={report.liabilities} />
              <SectionTable title="Equity" rows={report.equity} />

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">Total Assets</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{formatAmount(report.totals.total_assets)}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">Total Liabilities</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{formatAmount(report.totals.total_liabilities)}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">Total Equity</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{formatAmount(report.totals.total_equity)}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">Net Profit / (Loss)</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{formatAmount(report.totals.net_profit)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-semibold text-slate-900">
                      <td className="px-3 py-2 text-sm uppercase tracking-wide">Total Liabilities + Equity</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right text-sm">{formatAmount(report.totals.total_liabilities_equity)}</td>
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
