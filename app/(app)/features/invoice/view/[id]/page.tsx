"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../features/auth/hooks/useAuth";
import { getInvoice } from "../../api/getInvoice";
import { InvoiceView } from "../../components/InvoiceView";
import { toInvoiceFormData } from "../../lib/invoice";
import type { InvoiceFormData } from "../../types";

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [data, setData] = useState<InvoiceFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    let cancelled = false;
    (async () => {
      try {
        const invoice = await getInvoice(id, token);
        if (!cancelled) {
          setData(toInvoiceFormData(invoice));
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, id]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><p className="text-red-600">Error: {error}</p></main>;
  if (!data) return <main className="min-h-screen bg-slate-50 p-6"><p>Invoice not found.</p></main>;

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
