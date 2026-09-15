"use client";

import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import type { InvoiceFormData, InvoiceStringField } from "../types";

interface InvoiceFormProps {
  form: Pick<InvoiceFormData, InvoiceStringField>;
  errors?: Record<string, string>;
  onFieldChange: (field: InvoiceStringField, value: string) => void;
  onBlNumberLookup?: (blNumber: string) => void;
}

const TITLE_OPTIONS = [
  { value: "Invoice for Import Shipment", label: "Invoice for Import Shipment" },
  { value: "Invoice for Export Shipment", label: "Invoice for Export Shipment" },
];

const FIELDS: Array<{ label: string; field: InvoiceStringField; type?: "text" | "date" }> = [
  { label: "Invoice Number", field: "invoiceNumber" },
  { label: "Date", field: "date", type: "date" },
  { label: "B/L Number", field: "blNumber" },
  { label: "Customer's Name", field: "customerName" },
  { label: "Vessel", field: "vessel" },
  { label: "Voyage", field: "voyage" },
  { label: "Registration No.", field: "registrationNo" },
  { label: "Container(s)", field: "containers" },
];

export function InvoiceForm({ form, errors = {}, onFieldChange, onBlNumberLookup }: InvoiceFormProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Invoice details</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Select
          label="Invoice Title"
          value={form.title}
          options={TITLE_OPTIONS}
          onChange={(value) => onFieldChange("title", value)}
        />
        {FIELDS.map(({ label, field, type }) => (
          <Input
            key={field}
            label={label}
            type={type}
            value={form[field]}
            error={errors[field]}
            onBlur={field === "blNumber" && onBlNumberLookup ? onBlNumberLookup : undefined}
            onChange={(value) => onFieldChange(field, value)}
          />
        ))}
        <Input
          label="Exchange Rate (USD to BDT)"
          value={form.exRate}
          error={errors.exRate}
          onChange={(value) => onFieldChange("exRate", value)}
        />
        <Input
          label="Amount in Words"
          full
          value={form.inWord}
          onChange={(value) => onFieldChange("inWord", value)}
        />
        <Input
          label="Remarks"
          full
          value={form.remarks}
          onChange={(value) => onFieldChange("remarks", value)}
        />
      </div>
    </section>
  );
}