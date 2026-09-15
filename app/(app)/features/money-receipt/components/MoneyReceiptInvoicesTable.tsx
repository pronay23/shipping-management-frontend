"use client";

import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";
import type { MoneyReceiptInvoiceRow } from "../types";

interface MoneyReceiptInvoicesTableProps {
  invoices: MoneyReceiptInvoiceRow[];
  onPaidChange: (id: string | number, value: string) => void;
}

export function MoneyReceiptInvoicesTable({ invoices, onPaidChange }: MoneyReceiptInvoicesTableProps) {
  const paidTotal = invoices.reduce((sum, invoice) => sum + parseNumber(invoice.paidAmount), 0);

  if (invoices.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Invoices covered</h2>
        <p className="mt-3 text-sm text-slate-500">No invoices selected for this receipt.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Invoices covered</h2>
      <p className="mt-2 text-sm text-slate-600">
        Allocate the amount received against each invoice. This drives the linked invoice payment status
        (paid / partial / unpaid).
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Invoice No.</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">B/L Number</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-right font-semibold">Total USD</th>
              <th className="px-4 py-3 text-right font-semibold">Total BDT</th>
              <th className="px-4 py-3 text-right font-semibold">Paid Amount (BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
            {invoices.map((invoice) => {
              const totalUsd = invoice.total_usd != null ? parseNumber(String(invoice.total_usd)) : 0;
              const totalBdt = invoice.total_bdt != null ? parseNumber(String(invoice.total_bdt)) : 0;
              return (
                <tr key={String(invoice.id)} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-sky-600">{invoice.invoice_number ?? "—"}</td>
                  <td className="px-4 py-3">{invoice.invoice_date ?? "—"}</td>
                  <td className="px-4 py-3">{invoice.bl_number ?? "—"}</td>
                  <td className="px-4 py-3">{invoice.customer_name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">{totalUsd > 0 ? `$${formatCurrency(totalUsd)}` : "—"}</td>
                  <td className="px-4 py-3 text-right">{totalBdt > 0 ? formatCurrency(totalBdt) : "—"}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={invoice.paidAmount}
                      onChange={(e) => onPaidChange(invoice.id, e.target.value)}
                      className="w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-right text-sm outline-none focus:border-sky-300"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr>
              <td colSpan={6} className="px-4 py-3 text-right">
                Total Received (BDT)
              </td>
              <td className="px-4 py-3 text-right">{formatCurrency(paidTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}