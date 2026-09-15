import Link from "next/link";
import { getApInvoiceList } from "../api/getApInvoiceList";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

const STATUS_CLASSES: Record<string, string> = {
  unpaid: "bg-amber-100 text-amber-800",
  partial: "bg-blue-100 text-blue-800",
  paid: "bg-emerald-100 text-emerald-800",
  voided: "bg-slate-200 text-slate-600",
};

export default async function ApInvoiceListPage() {
  const invoices = await getApInvoiceList();

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Invoice</p>
              <h1 className="text-2xl font-semibold text-slate-900">Saved AP invoices</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review vendor invoices. Click on an entry to view details.
              </p>
            </div>
            <Link
              href="/features/ap-invoice/create"
              className="self-start rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              + Create AP Invoice
            </Link>
          </div>

          {invoices.length === 0 ? (
            <p className="text-sm text-slate-500">No AP invoices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Invoice #</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Vendor</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Total BDT</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Paid</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Due</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {invoices.map((inv) => {
                    const id = String(inv.id);
                    return (
                      <tr key={id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 font-semibold text-sky-600">
                          <Link href={`/features/ap-invoice/view/${inv.id}`} className="hover:underline">
                            {singleLine(inv.ap_invoice_number) || "—"}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(inv.invoice_date) || "—"}</td>
                        <td className="max-w-52 truncate px-3 py-2">{singleLine(inv.vendor?.vendor_name) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {inv.total_bdt != null ? formatCurrency(parseNumber(String(inv.total_bdt))) : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right text-emerald-700">
                          {inv.paid_amount != null && parseNumber(String(inv.paid_amount)) > 0
                            ? formatCurrency(parseNumber(String(inv.paid_amount)))
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right text-rose-700">
                          {inv.due_amount != null && parseNumber(String(inv.due_amount)) > 0
                            ? formatCurrency(parseNumber(String(inv.due_amount)))
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CLASSES[inv.status ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                            {inv.status ?? "—"}
                          </span>
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
