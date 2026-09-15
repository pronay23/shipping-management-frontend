"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { InvoiceListItem } from "../types";
import { parseNumber } from "../lib/invoice";
import { getInvoice } from "../api/getInvoice";
import { saveMoneyReceipt } from "../../money-receipt/api/saveMoneyReceipt";
import { buildMoneyReceiptForm, buildMoneyReceiptPayload } from "../../money-receipt/lib/money-receipt";
import { InvoiceTable } from "./InvoiceTable";

interface InvoiceFilterProps {
  invoices: InvoiceListItem[];
}

export function InvoiceFilter({ invoices }: InvoiceFilterProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [receivedInputs, setReceivedInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      invoices.map((invoice) => [
        String(invoice.id),
        invoice.received_bdt != null ? String(invoice.received_bdt) : "0",
      ])
    )
  );
  const [isSavingReceived, setIsSavingReceived] = useState(false);
  const [prevInvoices, setPrevInvoices] = useState(invoices);
  if (prevInvoices !== invoices) {
    setPrevInvoices(invoices);
    setReceivedInputs((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const invoice of invoices) {
        const id = String(invoice.id);
        const serverValue = invoice.received_bdt != null ? String(invoice.received_bdt) : "0";
        if (next[id] !== serverValue) {
          next[id] = serverValue;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((invoice) =>
      [invoice.invoice_number, invoice.customer_name, invoice.bl_number, invoice.vessel]
        .filter((value): value is string => typeof value === "string" && Boolean(value))
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [invoices, query]);

  const [paymentTermInputs, setPaymentTermInputs] = useState<Record<string, string>>({});

  const changedReceived = useMemo(() => {
    return invoices.filter((invoice) => {
      const original = parseNumber(invoice.received_bdt != null ? String(invoice.received_bdt) : "0");
      const entered = parseNumber(receivedInputs[String(invoice.id)] ?? "0");
      return entered !== original;
    });
  }, [invoices, receivedInputs]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(ids: string[]) {
    setSelectedIds(new Set(ids));
  }

  function handleReceivedChange(id: string, value: string) {
    setReceivedInputs((prev) => ({ ...prev, [id]: value }));
  }

  function handlePaymentTermChange(id: string, value: string) {
    setPaymentTermInputs((prev) => ({ ...prev, [id]: value }));
  }

  function handleGenerateReceipt() {
    if (selectedIds.size === 0) return;
    const selectedArray = [...selectedIds];
    const firstTerm = paymentTermInputs[selectedArray[0]] || "Cash";
    router.push(`/features/money-receipt/create?invoices=${selectedArray.join(",")}&paymentTerm=${encodeURIComponent(firstTerm)}`);
  }

  async function handleSaveReceived() {
    if (isSavingReceived || changedReceived.length === 0) return;
    setIsSavingReceived(true);
    try {
      for (const invoice of changedReceived) {
        const detail = await getInvoice(invoice.id);
        const form = buildMoneyReceiptForm([detail]);
        const chosenTerm = paymentTermInputs[String(invoice.id)] || "Cash";
        form.paymentTerm = chosenTerm;
        form.invoices[0].paidAmount = receivedInputs[String(invoice.id)] ?? "0";
        await saveMoneyReceipt(buildMoneyReceiptPayload(form));
      }
      alert(`Saved ${changedReceived.length} money receipt(s).`);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Received save failed:", error);
      alert(`Unable to save received amounts:\n${message}`);
    } finally {
      setIsSavingReceived(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by invoice number, customer, B/L or vessel..."
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring"
        />
        <div className="flex items-center gap-3">
          {changedReceived.length > 0 && (
            <button
              type="button"
              onClick={handleSaveReceived}
              disabled={isSavingReceived}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingReceived ? "Saving..." : `Save Received${changedReceived.length > 0 ? ` (${changedReceived.length})` : ""}`}
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerateReceipt}
            disabled={selectedIds.size === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Money Receipt{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>
      </div>
      <InvoiceTable
        invoices={filtered}
        selectedIds={selectedIds}
        onToggle={toggle}
        onToggleAll={toggleAll}
        receivedInputs={receivedInputs}
        onReceivedChange={handleReceivedChange}
        paymentTermInputs={paymentTermInputs}
        onPaymentTermChange={handlePaymentTermChange}
      />
    </div>
  );
}