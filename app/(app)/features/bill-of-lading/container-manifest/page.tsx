import ContainerManifestTable from "../components/ContainerManifestTable";
import { getContainerManifestList } from "../api/getContainerManifestList";

export default async function ContainerManifestPage() {
  const containers = await getContainerManifestList();

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
