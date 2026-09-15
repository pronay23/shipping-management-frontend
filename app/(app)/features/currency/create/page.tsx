"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CurrencyForm from "../components/CurrencyForm";
import { createCurrency } from "../api/createCurrency";

export default function CreateCurrencyPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(payload: {
    currency_code: string;
    currency_name: string;
    symbol: string;
    exchange_rate: number;
    is_base_currency: boolean;
    is_active: boolean;
  }) {
    await createCurrency(payload);
    setSuccessMsg("Currency created successfully!");
    setTimeout(() => {
      router.push("/features/currency/list");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Settings
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Add New Currency</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create a new currency with its code, name, symbol, and exchange rate.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          <CurrencyForm
            onSubmit={handleSubmit}
            submitLabel="Create Currency"
            submittingLabel="Creating..."
          />
        </section>
      </div>
    </main>
  );
}
