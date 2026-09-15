import type { JournalLineItem } from "../types";
import { formatCurrency, parseNumber } from "../../invoice/lib/invoice";

interface JournalLinesTableProps {
  lines?: JournalLineItem[] | null;
  totalDebit?: string | number | null;
  totalCredit?: string | number | null;
}

function singleLine(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function JournalLinesTable({ lines, totalDebit, totalCredit }: JournalLinesTableProps) {
  const rows = lines ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Account</th>
            <th className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">Type</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Reference</th>
            <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Note</th>
            <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Debit</th>
            <th className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-4 text-sm text-slate-500">
                No journal entry lines found.
              </td>
            </tr>
          ) : (
            rows.map((line) => {
              const debit = parseNumber(line.debit != null ? String(line.debit) : "0");
              const credit = parseNumber(line.credit != null ? String(line.credit) : "0");
              const reference = [line.reference, line.invoice_number].filter(Boolean).join(" · ");
              return (
                <tr key={String(line.id)} className="transition hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2">
                    {singleLine(line.account_name) || "—"}
                    {line.account_code ? (
                      <span className="ml-1 text-slate-400">({line.account_code})</span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-500">{singleLine(line.account_type) || "—"}</td>
                  <td className="max-w-52 truncate px-3 py-2">{reference || "—"}</td>
                  <td className="max-w-64 truncate px-3 py-2">{singleLine(line.note) || "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{debit > 0 ? formatCurrency(debit) : "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{credit > 0 ? formatCurrency(credit) : "—"}</td>
                </tr>
              );
            })
          )}
        </tbody>
        {rows.length > 0 ? (
          <tfoot className="border-t border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <td colSpan={4} className="whitespace-nowrap px-3 py-2 text-right font-semibold uppercase tracking-wide">
                Total
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-sky-700">
                {totalDebit != null ? formatCurrency(parseNumber(String(totalDebit))) : "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-sky-700">
                {totalCredit != null ? formatCurrency(parseNumber(String(totalCredit))) : "—"}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}