"use client";

import { Input } from "./ui/Input";
import type { InvoiceBankDetails as BankDetails } from "../types";

interface InvoiceBankDetailsProps {
  bankDetails: BankDetails;
  onBankFieldChange: (field: keyof BankDetails, value: string) => void;
}

const FIELDS: Array<{ label: string; field: keyof BankDetails; full?: boolean }> = [
  { label: "Account Name", field: "accountName" },
  { label: "RD Account No.", field: "rdAccountNo" },
  { label: "Bank Name", field: "bankName" },
  { label: "Branch Name", field: "branchName" },
  { label: "SWIFT Code", field: "swiftCode" },
  { label: "Routing No.", field: "routingNo" },
  { label: "Address", field: "address", full: true },
];

export function InvoiceBankDetails({ bankDetails, onBankFieldChange }: InvoiceBankDetailsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Bank Account Details</h2>
      <div className="mt-6 grid gap-4">
        {FIELDS.map(({ label, field, full }) => (
          <Input
            key={field}
            label={label}
            full={full}
            value={bankDetails[field]}
            onChange={(value) => onBankFieldChange(field, value)}
          />
        ))}
      </div>
    </section>
  );
}