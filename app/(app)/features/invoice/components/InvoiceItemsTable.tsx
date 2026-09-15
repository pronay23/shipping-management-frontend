"use client";

import { formatCurrency, getItemTotalBdt, getItemTotalUsd } from "../lib/invoice";
import type { InvoiceItem } from "../types";

const NUMERIC_FIELDS = ["qty20", "qty40", "rateUsd", "rateBdt"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  exRate: string;
  onItemChange: (key: string, field: NumericField | "label", value: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-sky-300";

export function InvoiceItemsTable({ items, exRate, onItemChange, onAdd, onRemove }: InvoiceItemsTableProps) {
  const totalUsd = items.reduce((sum, item) => sum + getItemTotalUsd(item), 0);
  const totalBdt = items.reduce((sum, item) => sum + getItemTotalBdt(item, exRate), 0);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Invoice items</h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          + Add row
        </button>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Particulars</th>
              <th className="px-3 py-3 text-center font-semibold">20&apos;</th>
              <th className="px-3 py-3 text-center font-semibold">40&apos;</th>
              <th className="px-3 py-3 text-center font-semibold">Rate USD</th>
              <th className="px-3 py-3 text-center font-semibold">Rate BDT</th>
              <th className="px-3 py-3 text-right font-semibold">Total USD</th>
              <th className="px-3 py-3 text-right font-semibold">Total BDT</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
            {items.map((item) => {
              const bdt = getItemTotalBdt(item, exRate);
              const usd = getItemTotalUsd(item);
              return (
                <tr key={item.key}>
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
                  <td className="px-3 py-2 text-right font-semibold text-slate-700">
                    {formatCurrency(usd)}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-700">
                    {formatCurrency(bdt)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onRemove(item.key)}
                      className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-100"
                    >
                      x
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-800">
            <tr>
              <td className="px-3 py-3">Total</td>
              <td colSpan={4} />
              <td className="px-3 py-3 text-right">{formatCurrency(totalUsd)}</td>
              <td className="px-3 py-3 text-right">{formatCurrency(totalBdt)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}