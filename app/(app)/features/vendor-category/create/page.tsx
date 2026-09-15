"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VendorCategoryForm from "../components/VendorCategoryForm";
import { createVendorCategory } from "../api/createVendorCategory";

export default function CreateVendorCategoryPage() {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(name: string, description: string) {
    await createVendorCategory({
      name,
      description: description || null,
    });
    setSuccessMsg("Vendor category created successfully!");
    setTimeout(() => {
      router.push("/features/vendor-category/list");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Vendor Management
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Add New Vendor Category</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create a new category to classify vendors (e.g. C&F Agent, Oversea Agent, Office Supplier).
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          <VendorCategoryForm
            onSubmit={handleSubmit}
            submitLabel="Create Vendor Category"
            submittingLabel="Creating..."
          />
        </section>
      </div>
    </main>
  );
}
