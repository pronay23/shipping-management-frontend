import { getInvoice } from "../api/getInvoice";
import { InvoiceBuilder } from "../components/InvoiceBuilder";
import { toInvoiceFormData } from "../lib/invoice";
import type { InvoiceFormData } from "../types";

interface CreateInvoicePageProps {
  searchParams: Promise<{ copy?: string }>;
}

export default async function CreateInvoicePage({ searchParams }: CreateInvoicePageProps) {
  const { copy } = await searchParams;

  let initialData: InvoiceFormData | undefined;
  if (copy) {
    const detail = await getInvoice(copy);
    initialData = toInvoiceFormData(detail);
    initialData.date = new Date().toISOString().slice(0, 10);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <InvoiceBuilder initialData={initialData} />
    </main>
  );
}
