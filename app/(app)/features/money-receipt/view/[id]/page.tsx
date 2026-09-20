"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../features/auth/hooks/useAuth";
import { getMoneyReceipt, MoneyReceiptDetail } from "../../api/getMoneyReceipt";
import { MoneyReceiptView } from "../../components/MoneyReceiptView";
import type { MoneyReceiptFormData } from "../../types";

function toMoneyReceiptFormData(detail: MoneyReceiptDetail): MoneyReceiptFormData {
  return {
    title: detail.title || "Money Receipt",
    moneyReceiptNumber: detail.money_receipt_number || "",
    moneyReceiptDate: detail.money_receipt_date || "",
    blNumber: detail.bl_number || "",
    customerName: detail.customer_name || "",
    vessel: detail.vessel || "",
    voyage: detail.voyage || "",
    registrationNo: detail.registration_no || "",
    containers: detail.containers || "",
    exRate: detail.exchange_rate != null ? String(detail.exchange_rate) : "110.00",
    inWord: detail.amount_in_words || "",
    paymentTerm: detail.payment_term || "",
    items: (detail.items || []).map((item) => ({
      key: item.key || String(item.id),
      label: item.label || "",
      invoiceNumber: null,
      qty20: item.qty_20 != null ? String(item.qty_20) : "",
      qty40: item.qty_40 != null ? String(item.qty_40) : "",
      rateUsd: item.rate_usd != null ? String(item.rate_usd) : "",
      rateBdt: item.rate_bdt != null ? String(item.rate_bdt) : "",
      totalUsd: item.total_usd != null ? String(item.total_usd) : "",
    })),
    invoices: (detail.invoices || []).map((inv) => ({
      id: inv.invoice_id,
      invoice_number: inv.invoice?.invoice_number || null,
      invoice_date: inv.invoice?.invoice_date || null,
      bl_number: inv.invoice?.bl_number || null,
      customer_name: inv.invoice?.customer_name || null,
      vessel: inv.invoice?.vessel || null,
      voyage: inv.invoice?.voyage || null,
      total_usd: inv.invoice?.total_usd || null,
      total_bdt: inv.invoice?.total_bdt || null,
      paidAmount: inv.paid_amount != null ? String(inv.paid_amount) : "",
    })),
  };
}

export default function MoneyReceiptViewPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [data, setData] = useState<MoneyReceiptFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await getMoneyReceipt(id, token);
        if (!cancelled) {
          setData(toMoneyReceiptFormData(detail));
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
  if (!data) return <main className="min-h-screen bg-slate-50 p-6"><p>Money receipt not found.</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Money Receipt</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {data.moneyReceiptNumber || "Saved money receipt"}
              </h1>
            </div>
          </div>
          <MoneyReceiptView data={data} />
        </section>
      </div>
    </main>
  );
}
