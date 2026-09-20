"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../../../features/auth/hooks/useAuth";
import { getTrialBalance } from "../../api/getTrialBalance";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";
import type { TrialBalanceReport } from "../../types";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default function TrialBalancePage() {
  const { token } = useAuth();
  const [report, setReport] = useState<TrialBalanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getTrialBalance(token);
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
  }, [token]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">Trial balance</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Per-account balances computed from approved journal entries. Voided vouchers and their reversals net
                out to zero.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/features/journal/reports/profit-loss"
                className="self-start rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Profit &amp; loss
              </Link>
              <Link
                href="/features/journal/list"
                className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Journal list
              </Link>
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : !report || report.rows.length === 0 ? (
            <p className="text-sm text-slate-500">No approved ledger activity found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Code
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Account</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Type</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total Debit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total Credit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Balance (Dr + / Cr &minus;)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {report.rows.map((row) => {
                    const accountId = String(row.account_id);
                    return (
                      <tr key={accountId} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(row.account_code) || "\u2014"}</td>
                        <td className="px-3 py-2">
                          <Link
                            href={`/features/journal/reports/${accountId}`}
                            className="font-semibold text-sky-600 hover:underline"
                          >
                            {singleLine(row.account_name) || "\u2014"}
                          </Link>
                        </td>
                        <td className="px-3 py-2 capitalize">{singleLine(row.account_type) || "\u2014"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {row.debit_total != null ? formatCurrency(parseNumber(String(row.debit_total))) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {row.credit_total != null ? formatCurrency(parseNumber(String(row.credit_total))) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          {row.balance != null ? formatCurrency(parseNumber(String(row.balance))) : "\u2014"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-semibold text-slate-900">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right uppercase tracking-wide">
                      Totals
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {report.totals.debit != null
                        ? formatCurrency(parseNumber(String(report.totals.debit)))
                        : "\u2014"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {report.totals.credit != null
                        ? formatCurrency(parseNumber(String(report.totals.credit)))
                        : "\u2014"}
                    </td>
                    <td className="px-3 py-2" />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
