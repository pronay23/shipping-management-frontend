"use client";

import { formatCurrency, getItemTotalBdt, parseNumber } from "../../invoice/lib/invoice";
import type { MoneyReceiptItemRow } from "../types";

const NUMERIC_FIELDS = ["qty20", "qty40", "rateUsd", "rateBdt", "totalUsd"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];

interface MoneyReceiptItemsTableProps {
  items: MoneyReceiptItemRow[];
  exRate: string;
  onItemChange: (key: string, field: NumericField | "label", value: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-sky-300";

export function MoneyReceiptItemsTable({ items, exRate, onItemChange }: MoneyReceiptItemsTableProps) {
  const totalUsd = items.reduce((sum, item) => sum + parseNumber(item.totalUsd), 0);
  const totalBdt = items.reduce((sum, item) => sum + getItemTotalBdt(item, exRate), 0);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Receipt items</h2>
        <span className="text-xs text-slate-400">Line items pre-filled from the selected invoices</span>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Invoice No.</th>
              <th className="px-3 py-3 text-left font-semibold">Particulars</th>
              <th className="px-3 py-3 text-center font-semibold">20&apos;</th>
              <th className="px-3 py-3 text-center font-semibold">40&apos;</th>
              <th className="px-3 py-3 text-center font-semibold">Rate USD</th>
              <th className="px-3 py-3 text-center font-semibold">Rate BDT</th>
              <th className="px-3 py-3 text-right font-semibold">Total USD</th>
              <th className="px-3 py-3 text-right font-semibold">Total BDT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
            {items.map((item) => {
              const bdt = getItemTotalBdt(item, exRate);
              return (
                <tr key={item.key}>
                  <td className="px-3 py-2 text-xs text-slate-500">{item.invoiceNumber ?? "—"}</td>
                  <td className="px-3 py-2">
                    <input
                      value={item.label}
                      onChange={(e) => onItemChange(item.key, "label", e.target.value)}
                      className={`${inputClass} text-left`}
                    />
                  </td>
                  {NUMERIC_FIELDS.map((f) => (
                    <td key={f} className="px-3 py-2">
                      <input
                        value={item[f]}
                        onChange={(e) => onItemChange(item.key, f, e.target.value)}
                        className={`${inputClass} text-center`}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold text-slate-700">{formatCurrency(bdt)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr>
              <td colSpan={2} className="px-3 py-3">
                Total
              </td>
              <td colSpan={4} />
              <td className="px-3 py-3 text-right">{formatCurrency(totalUsd)}</td>
              <td className="px-3 py-3 text-right">{formatCurrency(totalBdt)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}