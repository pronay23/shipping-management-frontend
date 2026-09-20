"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getInvoice } from "../api/getInvoice";
import { InvoiceBuilder } from "../components/InvoiceBuilder";
import { toInvoiceFormData } from "../lib/invoice";
import type { InvoiceFormData } from "../types";

export default function CreateInvoicePage() {
  const searchParams = useSearchParams();
  const copy = searchParams.get("copy");
  const { token } = useAuth();
  const [initialData, setInitialData] = useState<InvoiceFormData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        if (copy) {
          const detail = await getInvoice(copy, token);
          if (!cancelled) {
            const formData = toInvoiceFormData(detail);
            formData.date = new Date().toISOString().slice(0, 10);
            setInitialData(formData);
            setError(null);
          }
        } else {
          if (!cancelled) {
            setInitialData(undefined);
            setError(null);
          }
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
  }, [token, copy]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><p className="text-red-600">Error: {error}</p></main>;

  return (
    <main className="min-h-screen bg-slate-50">
      <InvoiceBuilder initialData={initialData} />
    </main>
  );
}
