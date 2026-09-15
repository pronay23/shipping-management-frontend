import { getInvoice } from "../../api/getInvoice";
import { InvoiceView } from "../../components/InvoiceView";
import { toInvoiceFormData } from "../../lib/invoice";

interface InvoiceViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceViewPage({ params }: InvoiceViewPageProps) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  const data = toInvoiceFormData(invoice);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Invoice</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {data.invoiceNumber || "Saved invoice"}
              </h1>
            </div>
          </div>
          <InvoiceView data={data} />
        </section>
      </div>
    </main>
  );
}
