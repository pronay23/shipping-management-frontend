"use client";

import { useEffect, useMemo, useState } from "react";

import { createDefaultInvoiceForm, createEmptyItem } from "../types";
import type { InvoiceBankDetails, InvoiceFormData, InvoiceItem, InvoiceStringField } from "../types";
import { calculateTotals, generateNextInvoiceNumber, getItemTotalUsd, numberToWords } from "../lib/invoice";
import { getInvoiceList } from "../api/getInvoiceList";

export function useInvoiceForm(initialData?: InvoiceFormData) {
  const [form, setForm] = useState<InvoiceFormData>(initialData ?? createDefaultInvoiceForm());
  const [resetKey, setResetKey] = useState(0);

  const totals = useMemo(() => calculateTotals(form.items, form.exRate), [form.items, form.exRate]);

  useEffect(() => {
    let cancelled = false;
    getInvoiceList()
      .then((invoices) => {
        if (cancelled) return;
        setForm((prev) => {
          const nextNumber = generateNextInvoiceNumber(
            prev.title,
            invoices.map((invoice) => invoice.invoice_number ?? "")
          );
          return nextNumber ? { ...prev, invoiceNumber: nextNumber } : prev;
        });
      })
      .catch(() => {
        if (cancelled) return;
        setForm((prev) => {
          const nextNumber = generateNextInvoiceNumber(prev.title, []);
          return nextNumber ? { ...prev, invoiceNumber: nextNumber } : prev;
        });
      });
    return () => {
      cancelled = true;
    };
  }, [form.title, initialData, resetKey]);

  useEffect(() => {
    if (totals.totalBdt <= 0) return;
    setForm((prev) => ({ ...prev, inWord: numberToWords(totals.totalBdt) }));
  }, [totals.totalBdt]);

  function updateField(field: InvoiceStringField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateBankField(field: keyof InvoiceBankDetails, value: string) {
    setForm((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [field]: value } }));
  }

  function updateItem(key: string, field: keyof InvoiceItem, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.key !== key) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty20" || field === "qty40" || field === "rateUsd") {
          updated.totalUsd = String(getItemTotalUsd(updated));
        }
        return updated;
      }),
    }));
  }

  function addItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }));
  }

  function removeItem(key: string) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((item) => item.key !== key) }));
  }

  function reset() {
    setForm(createDefaultInvoiceForm());
    setResetKey((key) => key + 1);
  }

  return {
    form,
    totals,
    setForm,
    updateField,
    updateBankField,
    updateItem,
    addItem,
    removeItem,
    reset,
  };
}
