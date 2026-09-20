"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import VoyageTable from "../components/VoyageTable";
import { getVoyageList } from "../api/voyageApi";
import type { Voyage } from "../api/voyageApi";

export default function VoyageListPage() {
  const { token } = useAuth();
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getVoyageList(token);
        if (!cancelled) {
          setVoyages(result);
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

  if (loading) return <main className="min-h-screen bg-[#F1F5F9] p-6"><p>Loading...</p></main>;
  if (error) return <main className="min-h-screen bg-[#F1F5F9] p-6"><p className="text-red-600">Error: {error}</p></main>;

  return (
    <main className="min-h-screen bg-[#F1F5F9] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">
                Manifest Control
              </p>
              <h1 className="font-serif text-2xl font-semibold text-[#0B2542]">
                Voyages
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-[#3E6990]">
                Manage voyages and generate IGM / EGM XML files for Bangladesh Customs (ASYCUDA World).
              </p>
            </div>
            <a
              href="/features/voyage/create"
              className="inline-flex shrink-0 items-center gap-2 rounded bg-[#0B2542] px-4 py-2.5 text-sm font-medium text-[#F1F5F9] transition hover:bg-[#123058]"
            >
              + New Voyage
            </a>
          </div>

          <VoyageTable voyages={voyages} />
        </section>
      </div>
    </main>
  );
}
