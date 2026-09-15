"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CountryForm from "../components/CountryForm";
import { createCountry } from "../api/createCountry";

export default function CreateCountryPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(countryCode: string, countryName: string) {
    await createCountry({ country_code: countryCode, country_name: countryName });
    setSuccessMsg("Country created successfully!");
    setTimeout(() => {
      router.push("/features/country/list");
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
            <h1 className="text-2xl font-semibold text-slate-900">Add New Country</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create a new country with its code and name.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          <CountryForm
            onSubmit={handleSubmit}
            submitLabel="Create Country"
            submittingLabel="Creating..."
          />
        </section>
      </div>
    </main>
  );
}
