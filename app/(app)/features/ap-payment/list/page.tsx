import Link from "next/link";
import { getApPaymentList } from "../api/getApPaymentList";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export default async function ApPaymentListPage() {
  const payments = await getApPaymentList();

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">AP Payment</p>
              <h1 className="text-2xl font-semibold text-slate-900">Saved AP payments</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review all payments made to vendors. Click on an entry to view details.
              </p>
            </div>
            <Link
              href="/features/ap-payment/create"
              className="self-start rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              + Create AP Payment
            </Link>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-slate-500">No AP payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Payment #</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Vendor</th>
                    <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Method</th>
                    <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Amount</th>
                    <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {payments.map((pmt) => {
                    const id = String(pmt.id);
                    return (
                      <tr key={id} className="transition hover:bg-slate-50">
                        <td className="whitespace-nowrap px-3 py-2 font-semibold text-sky-600">
                          <Link href={`/features/ap-payment/view/${pmt.id}`} className="hover:underline">
                            {singleLine(pmt.ap_payment_number) || "—"}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.payment_date) || "—"}</td>
                        <td className="max-w-52 truncate px-3 py-2">{singleLine(pmt.vendor?.vendor_name) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.payment_method) || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                          {pmt.amount != null ? formatCurrency(parseNumber(String(pmt.amount))) : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{singleLine(pmt.reference_number) || "—"}</td>
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
