"use client";

import { Input } from "../../invoice/components/ui/Input";
import { Select } from "../../invoice/components/ui/Select";
import { DEFAULT_PAYMENT_TERMS } from "../types";
import type { MoneyReceiptFormData, MoneyReceiptStringField } from "../types";

interface MoneyReceiptFormProps {
  form: Pick<MoneyReceiptFormData, MoneyReceiptStringField>;
  errors?: Record<string, string>;
  onFieldChange: (field: MoneyReceiptStringField, value: string) => void;
}

const FIELDS: Array<{ label: string; field: MoneyReceiptStringField; type?: "text" | "date" }> = [
  { label: "Money Receipt Number", field: "moneyReceiptNumber" },
  { label: "Receipt Date", field: "moneyReceiptDate", type: "date" },
  { label: "B/L Number", field: "blNumber" },
  { label: "Customer's Name", field: "customerName" },
  { label: "Vessel", field: "vessel" },
  { label: "Voyage", field: "voyage" },
  { label: "Registration No.", field: "registrationNo" },
  { label: "Container(s)", field: "containers" },
];

export function MoneyReceiptForm({ form, errors = {}, onFieldChange }: MoneyReceiptFormProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Receipt details</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          value={form.title}
          onChange={(value) => onFieldChange("title", value)}
        />
        {FIELDS.map(({ label, field, type }) => (
          <Input
            key={field}
            label={label}
            type={type}
            value={form[field]}
            error={errors[field]}
            onChange={(value) => onFieldChange(field, value)}
          />
        ))}
        <Input
          label="Exchange Rate (USD to BDT)"
          value={form.exRate}
          error={errors.exRate}
          onChange={(value) => onFieldChange("exRate", value)}
        />
        <Select
          label="Payment Term"
          value={form.paymentTerm}
          options={[
            { value: "", label: "Select payment term..." },
            ...DEFAULT_PAYMENT_TERMS.map((term) => ({ value: term, label: term })),
          ]}
          error={errors.paymentTerm}
          onChange={(value) => onFieldChange("paymentTerm", value)}
        />
        <Input
          label="Amount in Words"
          full
          value={form.inWord}
          onChange={(value) => onFieldChange("inWord", value)}
        />
      </div>
    </section>
  );
}