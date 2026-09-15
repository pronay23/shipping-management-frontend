"use client";

import VendorCategoryTable from "../components/VendorCategoryTable";

export default function VendorCategoryListPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                Vendor Management
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">Vendor Categories</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage vendor categories used to classify vendors (e.g. C&F Agent, Oversea Agent, Office Supplier).
              </p>
            </div>
            <div>
              <a
                href="/features/vendor-category/create"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vendor Category
              </a>
            </div>
          </div>

          <VendorCategoryTable />
        </section>
      </div>
    </main>
  );
}
