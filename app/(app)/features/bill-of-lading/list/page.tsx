import BillOfLadingTable from "../components/BillOfLadingTable";
import { getBillOfLadingList } from "../api/getBillOfLadingList";

export default async function BillOfLadingListPage() {
  const billOfLadingData = await getBillOfLadingList();

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
