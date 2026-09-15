import Link from "next/link";

import { getArAging } from "../../journal/api/getAging";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function formatAmount(value: string | number | null): string {
  return value != null ? formatCurrency(parseNumber(String(value))) : "—";
}

interface ArAgingPageProps {
  searchParams: Promise<{ as_of?: string }>;
}

const BUCKET_ORDER = ["0-30", "31-60", "61-90", "91+", "unknown"] as const;

export default async function ArAgingPage({ searchParams }: ArAgingPageProps) {
  const { as_of } = await searchParams;

  let report: Awaited<ReturnType<typeof getArAging>> | null = null;
  let errorMessage: string | null = null;

  try {
    report = await getArAging(as_of);
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">AR Aging</h1>
              <p className="mt-1 text-sm text-slate-500">As of: {report?.meta.as_of ?? "today"}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Outstanding receivables bucketed by age. Derived from approved journal entries.
              </p>
            </div>
            <Link
              href="/features/journal/reports/trial-balance"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Trial balance
            </Link>
          </div>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p>
          ) : !report || report.data.length === 0 ? (
            <p className="text-sm text-slate-500">No outstanding receivables found.</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-3">
                {BUCKET_ORDER.map((bucket) => {
                  const bucketRows = report.data.filter((r) => r.bucket === bucket);
                  const bucketTotal = bucketRows.reduce((sum, r) => sum + parseNumber(String(r.outstanding ?? 0)), 0);
                  if (bucketTotal === 0) return null;
                  return (
                    <div key={bucket} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-center">
                      <p className="text-xs font-medium text-slate-500">{bucket} days</p>
                      <p className="text-sm font-semibold">{formatCurrency(bucketTotal)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Invoice #</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Customer</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Days</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Bucket</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {report.data.map((row, i) => (
                      <tr key={i} className="transition hover:bg-slate-50">
                        <td className="px-3 py-2 font-semibold text-sky-600">{singleLine(row.invoice_number) || "—"}</td>
                        <td className="max-w-48 truncate px-3 py-2">{singleLine(row.customer_name) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(row.invoice_date) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">{row.days_outstanding ?? "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(row.bucket) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">{formatAmount(row.outstanding)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-semibold text-slate-900">
                    <tr>
                      <td colSpan={5} className="px-3 py-2 text-right uppercase tracking-wide">Total Outstanding</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">{formatAmount(report.totals.total_outstanding)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
