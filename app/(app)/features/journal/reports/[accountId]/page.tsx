import Link from "next/link";

import { getAccountLedger } from "../../api/getAccountLedger";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";

interface AccountLedgerPageProps {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ page?: string | string[] | undefined }>;
}

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default async function AccountLedgerPage({ params, searchParams }: AccountLedgerPageProps) {
  const { accountId } = await params;
  const resolvedSearchParams = await searchParams;

  const rawPage = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page;
  const parsedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const report = await getAccountLedger(accountId, page).catch((error: unknown) => {
    if (error instanceof Error) return { error };
    return { error: new Error(String(error)) };
  });

  if ("error" in report) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">General ledger</h1>
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {report.error.message}
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

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Ledger Report</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {report.account?.code ? `${report.account.code} — ` : ""}
                {singleLine(report.account?.name) || "General ledger"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {report.account?.type ? (
                  <>
                    <span className="capitalize">{report.account.type}</span>
                    <span className="text-slate-300">•</span>
                  </>
                ) : null}
                <span>
                  Opening balance:{" "}
                  {report.account?.opening_balance != null
                    ? formatCurrency(parseNumber(String(report.account.opening_balance)))
                    : "—"}
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
                      <td className="whitespace-nowrap px-3 py-2">{singleLine(row.entry_date) || "—"}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        {row.journal_entry_id != null ? (
                          <Link
                            href={`/features/journal/view/${String(row.journal_entry_id)}`}
                            className="font-semibold text-sky-600 hover:underline"
                          >
                            {singleLine(row.voucher_number) || "—"}
                          </Link>
                        ) : (
                          singleLine(row.voucher_number) || "—"
                        )}
                      </td>
                      <td className="max-w-60 truncate px-3 py-2">{singleLine(row.reference) || "—"}</td>
                      <td className="max-w-80 truncate px-3 py-2">{singleLine(row.note) || "—"}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {row.debit != null && parseNumber(String(row.debit)) !== 0
                          ? formatCurrency(parseNumber(String(row.debit)))
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {row.credit != null && parseNumber(String(row.credit)) !== 0
                          ? formatCurrency(parseNumber(String(row.credit)))
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                        {row.running_balance != null
                          ? formatCurrency(parseNumber(String(row.running_balance)))
                          : "—"}
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
