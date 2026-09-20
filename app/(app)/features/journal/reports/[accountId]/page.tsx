"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../../features/auth/hooks/useAuth";
import { getAccountLedger } from "../../api/getAccountLedger";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";
import type { AccountLedgerReport } from "../../types";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default function AccountLedgerPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [report, setReport] = useState<AccountLedgerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !accountId) return;
    let cancelled = false;
    (async () => {
      try {
        const rawPage = searchParams.get("page");
        const parsedPage = Number.parseInt(rawPage ?? "1", 10);
        const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const result = await getAccountLedger(accountId, page, 50, token);
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
  }, [token, accountId, searchParams]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">General ledger</h1>
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
            <Link
              href="/features/journal/reports/trial-balance"
              className="mt-4 inline-block rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to trial balance
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (!report) return <main className="min-h-screen bg-slate-50 p-6"><p>Account ledger not found.</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {report.account?.code ? `${report.account.code} \u2014 ` : ""}
                {singleLine(report.account?.name) || "General ledger"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {report.account?.type ? (
                  <>
                    <span className="capitalize">{report.account.type}</span>
                    <span className="text-slate-300">&bull;</span>
                  </>
                ) : null}
                <span>
                  Opening balance:{" "}
                  {report.account?.opening_balance != null
                    ? formatCurrency(parseNumber(String(report.account.opening_balance)))
                    : "\u2014"}
                </span>
              </div>
            </div>
            <Link
              href="/features/journal/reports/trial-balance"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Trial balance
            </Link>
          </div>

          {report.rows.length === 0 ? (
            <p className="text-sm text-slate-500">No ledger activity for this account.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Voucher No.
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Reference</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Note</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Debit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Credit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Running Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {report.rows.map((row, index) => (
                    <tr key={`${row.journal_entry_id ?? "na"}-${index}`} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-3 py-2">{singleLine(row.entry_date) || "\u2014"}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        {row.journal_entry_id != null ? (
                          <Link
                            href={`/features/journal/view/${String(row.journal_entry_id)}`}
                            className="font-semibold text-sky-600 hover:underline"
                          >
                            {singleLine(row.voucher_number) || "\u2014"}
                          </Link>
                        ) : (
                          singleLine(row.voucher_number) || "\u2014"
                        )}
                      </td>
                      <td className="max-w-60 truncate px-3 py-2">{singleLine(row.reference) || "\u2014"}</td>
                      <td className="max-w-80 truncate px-3 py-2">{singleLine(row.note) || "\u2014"}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {row.debit != null && parseNumber(String(row.debit)) !== 0
                          ? formatCurrency(parseNumber(String(row.debit)))
                          : "\u2014"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {row.credit != null && parseNumber(String(row.credit)) !== 0
                          ? formatCurrency(parseNumber(String(row.credit)))
                          : "\u2014"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                        {row.running_balance != null
                          ? formatCurrency(parseNumber(String(row.running_balance)))
                          : "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {report.meta.last_page > 1 ? (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                Page {report.meta.current_page} of {report.meta.last_page} ({report.meta.total} entries)
              </span>
              <div className="flex items-center gap-2">
                {report.meta.current_page > 1 ? (
                  <Link
                    href={`/features/journal/reports/${accountId}?page=${report.meta.current_page - 1}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Previous
                  </Link>
                ) : null}
                {report.meta.current_page < report.meta.last_page ? (
                  <Link
                    href={`/features/journal/reports/${accountId}?page=${report.meta.current_page + 1}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
