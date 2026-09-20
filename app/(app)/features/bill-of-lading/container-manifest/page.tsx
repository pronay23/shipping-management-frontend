"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import ContainerManifestTable from "../components/ContainerManifestTable";
import { getContainerManifestList } from "../api/getContainerManifestList";
import type { ContainerManifestListItem } from "../api/getContainerManifestList";

export default function ContainerManifestPage() {
  const { token } = useAuth();
  const [containers, setContainers] = useState<ContainerManifestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await getContainerManifestList(token);
        if (!cancelled) {
          setContainers(result);
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
                Container Manifest
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Container Manifest Table
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review container manifest rows for stored shipments. Use the table below to scan current manifest data.
              </p>
            </div>
          </div>

          <ContainerManifestTable containers={containers} />
        </section>
      </div>
    </main>
  );
}
