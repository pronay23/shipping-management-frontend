"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import BillOfLadingTable from "../components/BillOfLadingTable";
import { getBillOfLadingList } from "../api/getBillOfLadingList";
import type { BillOfLadingListItem } from "../api/getBillOfLadingList";

export default function BillOfLadingListPage() {
  const { token } = useAuth();
  const [billOfLadingData, setBillOfLadingData] = useState<BillOfLadingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getBillOfLadingList(token);
        if (!cancelled) {
          setBillOfLadingData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  if (loading) return <main className="min-h-screen bg-slate-50 p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-slate-50 p-6"><p className="text-red-600">Error: {error}</p></main>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                Bill of Lading
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Shipment manifests
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review the current list of bill of lading shipments. Click on an entry to see more details or create a new manifest from the sidebar.
              </p>
            </div>
          </div>

          <BillOfLadingTable bills={billOfLadingData} />
        </section>
      </div>
    </main>
  );
}
