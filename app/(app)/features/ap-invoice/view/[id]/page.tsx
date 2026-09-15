import Link from "next/link";
import { getApInvoice } from "../../api/getApInvoice";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

interface ViewApInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewApInvoicePage({ params }: ViewApInvoicePageProps) {
  const { id } = await params;
  const invoice = await getApInvoice(id);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Invoice</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {singleLine(invoice.ap_invoice_number) || "AP Invoice"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Vendor: {singleLine(invoice.vendor?.vendor_name) || "—"} &middot; Date: {singleLine(invoice.invoice_date) || "—"}
              </p>
            </div>
            <Link
              href="/features/ap-invoice/list"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to list
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Status</p>
              <p className="text-sm font-semibold capitalize">{singleLine(invoice.status) || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Due Date</p>
              <p className="text-sm">{singleLine(invoice.due_date) || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Reference</p>
              <p className="text-sm">{singleLine(invoice.reference) || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total BDT</p>
              <p className="text-sm font-semibold">
                {invoice.total_bdt != null ? formatCurrency(parseNumber(String(invoice.total_bdt))) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Paid Amount</p>
              <p className="text-sm font-semibold text-emerald-700">
                {invoice.paid_amount != null ? formatCurrency(parseNumber(String(invoice.paid_amount))) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Due Amount</p>
              <p className="text-sm font-semibold text-rose-700">
                {invoice.due_amount != null ? formatCurrency(parseNumber(String(invoice.due_amount))) : "—"}
              </p>
            </div>
          </div>

          {invoice.description && (
            <p className="mt-4 text-sm text-slate-600">{invoice.description}</p>
          )}

          {invoice.items && invoice.items.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Line Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Description</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Qty</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Unit Price</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {invoice.items.map((item, i) => (
                      <tr key={i} className="transition hover:bg-slate-50">
                        <td className="px-3 py-2">{singleLine(item.description) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">{item.quantity ?? "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right">
                          {item.unit_price != null ? formatCurrency(parseNumber(String(item.unit_price))) : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          {item.total_bdt != null ? formatCurrency(parseNumber(String(item.total_bdt))) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {invoice.payment_links && invoice.payment_links.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Payment #</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Method</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {invoice.payment_links.map((link, i) => (
                      <tr key={i} className="transition hover:bg-slate-50">
                        <td className="px-3 py-2 font-semibold text-sky-600">
                          {singleLine(link.payment?.ap_payment_number) || "—"}
                        </td>
                        <td className="px-3 py-2">{singleLine(link.payment?.payment_date) || "—"}</td>
                        <td className="px-3 py-2">{singleLine(link.payment?.payment_method) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-emerald-700">
                          {link.paid_amount != null ? formatCurrency(parseNumber(String(link.paid_amount))) : "—"}
                        </td>
                      </tr>
                    ))}
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
