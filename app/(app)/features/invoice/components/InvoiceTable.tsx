"use client";

import Link from "next/link";

import { formatCurrency, parseNumber } from "../lib/invoice";
import type { InvoiceListItem } from "../types";
import { InvoiceStatus } from "./InvoiceStatus";

const PAYMENT_TERM_OPTIONS = ["Cash", "Cheque", "Pay Order", "Bank Transfer", "TT / Wire Transfer", "Online Payment"];

interface InvoiceTableProps {
  invoices: InvoiceListItem[];
  selectedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  receivedInputs: Readonly<Record<string, string>>;
  onReceivedChange: (id: string, value: string) => void;
  paymentTermInputs: Readonly<Record<string, string>>;
  onPaymentTermChange: (id: string, value: string) => void;
}

export function InvoiceTable({
  invoices,
  selectedIds,
  onToggle,
  onToggleAll,
  receivedInputs,
  onReceivedChange,
  paymentTermInputs,
  onPaymentTermChange,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return <p className="text-sm text-slate-500">No invoices found.</p>;
  }

  const allSelected = invoices.every((invoice) => selectedIds.has(String(invoice.id)));
  const someSelected = invoices.some((invoice) => selectedIds.has(String(invoice.id)));

  function singleLine(value: string | null | undefined): string {
    return (value ?? "").replace(/\s+/g, " ").trim();
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="w-10 px-3 py-2 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={(e) => onToggleAll(e.target.checked ? invoices.map((invoice) => String(invoice.id)) : [])}
                className="h-3.5 w-3.5 rounded border-slate-300 accent-sky-600"
                aria-label="Select all invoices"
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Invoice Number</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Bill Number</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Title</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Date</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Customer</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Vessel</th>
            <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Total USD</th>
            <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Total BDT</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Remarks</th>
            <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Received</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Payment Term</th>
            <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide">Due</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {invoices.map((invoice) => {
            const id = String(invoice.id);
            const selectedTerm = paymentTermInputs[id] || "Cash";
            return (
              <tr key={id} className="transition hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(id)}
                    onChange={() => onToggle(id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-sky-600"
                    aria-label={`Select invoice ${invoice.invoice_number ?? id}`}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <Link
                    href={`/features/invoice/create?copy=${invoice.id}`}
                    className="font-semibold text-sky-600 hover:underline"
                  >
                    {singleLine(invoice.invoice_number) || "—"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-2">{singleLine(invoice.bl_number) || "—"}</td>
                <td className="max-w-40 truncate px-3 py-2">{singleLine(invoice.title) || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2">{singleLine(invoice.invoice_date) || "—"}</td>
                <td className="max-w-52 truncate px-3 py-2">{singleLine(invoice.customer_name) || "—"}</td>
                <td className="max-w-40 truncate px-3 py-2">{singleLine(invoice.vessel) || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  {invoice.total_usd != null ? `$${formatCurrency(parseNumber(String(invoice.total_usd)))}` : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  {invoice.total_bdt != null ? formatCurrency(parseNumber(String(invoice.total_bdt))) : "—"}
                </td>
                <td className="max-w-52 truncate px-3 py-2">{singleLine(invoice.remarks) || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <input
                    type="number"
                    min={0}
                    value={receivedInputs[id] ?? "0"}
                    onChange={(e) => onReceivedChange(id, e.target.value)}
                    className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right text-xs text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring"
                    aria-label={`Received amount for invoice ${invoice.invoice_number ?? id}`}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <select
                    value={selectedTerm}
                    onChange={(e) => onPaymentTermChange(id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-900 outline-none focus:border-sky-300 focus:ring"
                  >
                    {PAYMENT_TERM_OPTIONS.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right text-rose-700 font-medium">
                  {formatCurrency(
                    Math.max(
                      0,
                      parseNumber(invoice.total_bdt != null ? String(invoice.total_bdt) : "0") -
                      parseNumber(receivedInputs[id] ?? "0")
                    )
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <InvoiceStatus status={invoice.status}>{invoice.status_label ?? "Saved"}</InvoiceStatus>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
