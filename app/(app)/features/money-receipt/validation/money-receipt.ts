import type { MoneyReceiptFormData } from "../types";
import { parseNumber } from "../../invoice/lib/invoice";

export interface MoneyReceiptFieldError {
  field: string;
  message: string;
}

export function validateMoneyReceipt(form: MoneyReceiptFormData): MoneyReceiptFieldError[] {
  const errors: MoneyReceiptFieldError[] = [];

  if (!form.moneyReceiptNumber.trim()) {
    errors.push({ field: "moneyReceiptNumber", message: "Money receipt number is required." });
  }
  if (!form.moneyReceiptDate) {
    errors.push({ field: "moneyReceiptDate", message: "Receipt date is required." });
  }
  if (!form.customerName.trim()) {
    errors.push({ field: "customerName", message: "Customer's name is required." });
  }
  if (!form.exRate.trim() || parseNumber(form.exRate) <= 0) {
    errors.push({ field: "exRate", message: "A valid exchange rate is required." });
  }
  if (!form.paymentTerm.trim()) {
    errors.push({ field: "paymentTerm", message: "Payment term is required." });
  }
  if (form.items.length === 0) {
    errors.push({ field: "items", message: "Add at least one receipt line item." });
  }
  if (form.invoices.length === 0) {
    errors.push({ field: "invoices", message: "Select at least one invoice for this receipt." });
  } else if (form.invoices.every((invoice) => parseNumber(invoice.paidAmount) <= 0)) {
    errors.push({ field: "invoices", message: "Enter a paid amount for at least one invoice." });
  }

  return errors;
}

export function errorsToRecord(errors: MoneyReceiptFieldError[]): Record<string, string> {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
}