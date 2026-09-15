import type { InvoiceFormData } from "../types";
import { parseNumber } from "../lib/invoice";

export interface InvoiceFieldError {
  field: string;
  message: string;
}

export function validateInvoice(form: InvoiceFormData): InvoiceFieldError[] {
  const errors: InvoiceFieldError[] = [];

  if (!form.invoiceNumber.trim()) {
    errors.push({ field: "invoiceNumber", message: "Invoice number is required." });
  }
  if (!form.customerName.trim()) {
    errors.push({ field: "customerName", message: "Customer's name is required." });
  }
  if (!form.date) {
    errors.push({ field: "date", message: "Invoice date is required." });
  }
  if (!form.exRate.trim() || parseNumber(form.exRate) <= 0) {
    errors.push({ field: "exRate", message: "A valid exchange rate is required." });
  }
  if (form.items.length === 0) {
    errors.push({ field: "items", message: "Add at least one invoice line item." });
  }

  return errors;
}

export function errorsToRecord(errors: InvoiceFieldError[]): Record<string, string> {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
}
