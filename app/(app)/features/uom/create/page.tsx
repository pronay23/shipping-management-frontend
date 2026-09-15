"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UomForm from "../components/UomForm";
import { createUom } from "../api/createUom";

export default function CreateUomPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(uomName: string, uomDescription: string) {
    await createUom({ uom_name: uomName, uom_description: uomDescription || null });
    setSuccessMsg("UOM created successfully!");
    setTimeout(() => {
      router.push("/features/uom/list");
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
            <h1 className="text-2xl font-semibold text-slate-900">Add New UOM</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create a new unit of measure for items.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          <UomForm
            onSubmit={handleSubmit}
            submitLabel="Create UOM"
            submittingLabel="Creating..."
          />
        </section>
      </div>
    </main>
  );
}
