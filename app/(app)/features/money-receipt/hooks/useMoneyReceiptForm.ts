"use client";

import { useEffect, useMemo, useState } from "react";

import type { MoneyReceiptFormData, MoneyReceiptInvoiceRow, MoneyReceiptItemRow, MoneyReceiptStringField } from "../types";
import { calculateMoneyReceiptTotals, calculatePaidTotal } from "../lib/money-receipt";
import { numberToWords } from "../../invoice/lib/invoice";

export function useMoneyReceiptForm(initialData: MoneyReceiptFormData) {
  const [form, setForm] = useState<MoneyReceiptFormData>(initialData);

  const totals = useMemo(
    () => calculateMoneyReceiptTotals({ items: form.items, exRate: form.exRate }),
    [form.items, form.exRate]
  );

  const paidTotal = useMemo(
    () => calculatePaidTotal({ invoices: form.invoices }),
    [form.invoices]
  );

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      inWord: paidTotal > 0 ? numberToWords(paidTotal) : "",
    }));
  }, [paidTotal]);

  function updateField(field: MoneyReceiptStringField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateItem(key: string, field: keyof MoneyReceiptItemRow, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.key === key ? { ...item, [field]: value } : item)),
    }));
  }

  function updateInvoicePaid(id: string | number, value: string) {
    setForm((prev) => ({
      ...prev,
      invoices: prev.invoices.map((invoice) => (invoice.id === id ? { ...invoice, paidAmount: value } : invoice)),
    }));
  }

  function updateInvoice(id: string | number, patch: Partial<MoneyReceiptInvoiceRow>) {
    setForm((prev) => ({
      ...prev,
      invoices: prev.invoices.map((invoice) => (invoice.id === id ? { ...invoice, ...patch } : invoice)),
    }));
  }

  return {
    form,
    totals,
    setForm,
    updateField,
    updateItem,
    updateInvoicePaid,
    updateInvoice,
  };
}