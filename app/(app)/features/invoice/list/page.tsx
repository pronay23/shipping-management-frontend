import { getInvoiceList } from "../api/getInvoiceList";
import { InvoiceFilter } from "../components/InvoiceFilter";
import { computeReceivedByInvoice, parseNumber } from "../lib/invoice";
import { getMoneyReceiptList } from "../../money-receipt/api/getMoneyReceiptList";

export default async function InvoiceListPage() {
  const [invoices, receipts] = await Promise.all([getInvoiceList(), getMoneyReceiptList()]);
  const receivedByInvoice = computeReceivedByInvoice(receipts);

  const invoicesWithBalances = invoices.map((invoice) => {
    const id = String(invoice.id);
    const totalBdt = parseNumber(invoice.total_bdt != null ? String(invoice.total_bdt) : "0");
    const receivedBdt = receivedByInvoice[id] ?? 0;
    return {
      ...invoice,
      received_bdt: receivedBdt,
      due_bdt: Math.max(0, totalBdt - receivedBdt),
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Invoice</p>
              <h1 className="text-2xl font-semibold text-slate-900">Saved invoices</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review saved import shipment invoices. Click on an entry to view it or download the PDF.
              </p>
            </div>
          </div>
          <InvoiceFilter invoices={invoicesWithBalances} />
        </section>
      </div>
    </main>
  );
}
