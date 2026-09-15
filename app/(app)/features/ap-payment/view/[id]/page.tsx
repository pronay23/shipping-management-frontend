import Link from "next/link";
import { getApPayment } from "../../api/getApPayment";
import { formatCurrency, parseNumber } from "../../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

interface ViewApPaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewApPaymentPage({ params }: ViewApPaymentPageProps) {
  const { id } = await params;
  const payment = await getApPayment(id);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Payment</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {singleLine(payment.ap_payment_number) || "AP Payment"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Vendor: {singleLine(payment.vendor?.vendor_name) || "—"} &middot; Date: {singleLine(payment.payment_date) || "—"}
              </p>
            </div>
            <Link
              href="/features/ap-payment/list"
              className="self-start rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to list
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Payment Method</p>
              <p className="text-sm font-semibold">{singleLine(payment.payment_method) || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Amount</p>
              <p className="text-sm font-semibold text-emerald-700">
                {payment.amount != null ? formatCurrency(parseNumber(String(payment.amount))) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Reference</p>
              <p className="text-sm">{singleLine(payment.reference_number) || "—"}</p>
            </div>
          </div>

          {payment.notes && (
            <p className="mt-4 text-sm text-slate-600">{payment.notes}</p>
          )}

          {payment.invoice_links && payment.invoice_links.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Invoice Allocations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">AP Invoice #</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Invoice Date</th>
                      <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Paid Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {payment.invoice_links.map((link, i) => (
                      <tr key={i} className="transition hover:bg-slate-50">
                        <td className="px-3 py-2 font-semibold text-sky-600">
                          {singleLine(link.invoice?.ap_invoice_number) || "—"}
                        </td>
                        <td className="px-3 py-2">{singleLine(link.invoice?.invoice_date) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
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
