"use client";

import { useEffect, useState } from "react";

import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { getInvoiceList } from "../api/getInvoiceList";
import { InvoiceFilter } from "../components/InvoiceFilter";
import { computeReceivedByInvoice, parseNumber } from "../lib/invoice";
import { getMoneyReceiptList } from "../../money-receipt/api/getMoneyReceiptList";
import type { InvoiceListItem } from "../types";

interface InvoiceWithBalance extends InvoiceListItem {
  received_bdt: number;
  due_bdt: number;
}

export default function InvoiceListPage() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const [invoiceData, receiptData] = await Promise.all([
          getInvoiceList(token),
          getMoneyReceiptList(token),
        ]);

        if (cancelled) return;

        const receivedByInvoice = computeReceivedByInvoice(receiptData);

        const enriched = invoiceData.map((invoice) => {
          const id = String(invoice.id);
          const totalBdt = parseNumber(invoice.total_bdt != null ? String(invoice.total_bdt) : "0");
          const receivedBdt = receivedByInvoice[id] ?? 0;
          return {
            ...invoice,
            received_bdt: receivedBdt,
            due_bdt: Math.max(0, totalBdt - receivedBdt),
          };
        });

        setInvoices(enriched);
        setError(null);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Loading invoices...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">Failed to load invoices: {error}</p>
          </section>
        </div>
      </main>
    );
  }

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
          <InvoiceFilter invoices={invoices} />
        </section>
      </div>
    </main>
  );
}
