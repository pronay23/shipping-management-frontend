import Link from "next/link";

import { getJournalEntryList } from "../api/getJournalEntryList";
import { getInvoiceList } from "../../invoice/api/getInvoiceList";
import { getMoneyReceiptList } from "../../money-receipt/api/getMoneyReceiptList";
import { JournalStatusBadge } from "../components/JournalStatusBadge";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default async function JournalEntryListPage() {
  const [entries, invoices, receipts] = await Promise.all([
    getJournalEntryList(),
    getInvoiceList(),
    getMoneyReceiptList(),
  ]);

  const invoiceBlMap = new Map(invoices.map((inv) => [String(inv.id), inv.bl_number]));
  const receiptBlMap = new Map(receipts.map((rec) => [String(rec.id), rec.bl_number]));

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Journal Entry</p>
              <h1 className="text-2xl font-semibold text-slate-900">Journal vouchers</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Double-entry vouchers created automatically when invoices and money receipts are saved. Approve a voucher
                to post it to the ledger, or void it to reverse the posting.
              </p>
            </div>
            <Link
              href="/features/journal/reports/trial-balance"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ledger reports
            </Link>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-slate-500">No journal entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Voucher No.
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                      B/L Number
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Source</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Memo</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total Debit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Total Credit
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                      Lines
                    </th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {entries.map((entry) => {
                    const id = String(entry.id);
                    const sourceLabel =
                      entry.source_type === "money_receipt"
                        ? "Money Receipt"
                        : entry.source_type === "invoice"
                          ? "Invoice"
                          : "—";

                    const blNumber =
                      entry.source_type === "invoice"
                        ? invoiceBlMap.get(String(entry.source_id))
                        : entry.source_type === "money_receipt"
                          ? receiptBlMap.get(String(entry.source_id))
                          : null;

                    return (
                      <tr key={id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2">
                          <Link
                            href={`/features/journal/view/${id}`}
                            className="font-semibold text-sky-600 hover:underline"
                          >
                            {singleLine(entry.voucher_number) || "—"}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(entry.entry_date) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(blNumber) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{sourceLabel}</td>
                        <td className="max-w-80 truncate px-3 py-2">{singleLine(entry.memo) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {entry.total_debit != null
                            ? formatCurrency(parseNumber(String(entry.total_debit)))
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {entry.total_credit != null
                            ? formatCurrency(parseNumber(String(entry.total_credit)))
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">{entry.line_count ?? "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <JournalStatusBadge status={entry.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}