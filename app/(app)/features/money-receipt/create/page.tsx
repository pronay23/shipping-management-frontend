import { getInvoice } from "../../invoice/api/getInvoice";
import { computeReceivedByInvoice } from "../../invoice/lib/invoice";
import { MoneyReceipt } from "../components/MoneyReceipt";
import { getMoneyReceiptList } from "../api/getMoneyReceiptList";
import type { InvoiceDetail } from "../../invoice/types";

interface MoneyReceiptCreatePageProps {
  searchParams: Promise<{ invoices?: string; paymentTerm?: string }>;
}

export default async function MoneyReceiptCreatePage({ searchParams }: MoneyReceiptCreatePageProps) {
  const { invoices, paymentTerm } = await searchParams;
  const ids = (invoices ?? "").split(",").map((id) => id.trim()).filter(Boolean);

  const [invoiceDetails, receipts] = await Promise.all([
    (async () => {
      const details: InvoiceDetail[] = [];
      for (const id of ids) {
        try {
          details.push(await getInvoice(id));
        } catch (error) {
          console.error(`Failed to load invoice ${id}:`, error);
        }
      }
      return details;
    })(),
    getMoneyReceiptList(),
  ]);

  const receivedByInvoice = computeReceivedByInvoice(receipts);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Money Receipt</p>
              <h1 className="text-2xl font-semibold text-slate-900">Generate money receipt</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review the selected invoices, fill in the receipt details, then save the receipt and download
                the money receipt PDF.
              </p>
            </div>
          </div>
          {invoiceDetails.length === 0 ? (
            <p className="text-sm text-slate-500">
              No invoices selected. Go back and check at least one invoice.
            </p>
          ) : (
            <MoneyReceipt
              invoices={invoiceDetails}
              receivedByInvoice={receivedByInvoice}
              initialPaymentTerm={paymentTerm}
            />
          )}
        </section>
      </div>
    </main>
  );
}