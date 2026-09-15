import Link from "next/link";

const KPIS = [
  { label: "Open Bookings", value: 24, description: "Active booking references awaiting confirmation." },
  { label: "Pending B/Ls", value: 12, description: "Draft and pending bill of lading records." },
  { label: "Containers in Transit", value: 8, description: "Containers currently en route to discharge." },
  { label: "Upcoming ETAs", value: 5, description: "Estimated arrivals in the next 7 days." },
];

const QUICK_LINKS = [
  { label: "Create Bill of Lading", href: "/features/bill-of-lading/create" },
  { label: "View B/L List", href: "/features/bill-of-lading/list" },
  { label: "Container Manifest", href: "/features/bill-of-lading/container-manifest" },
  { label: "Create Invoice", href: "/features/invoice/create" },
  { label: "Invoice List", href: "/features/invoice/list" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-128px)] max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Shipping operations overview</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Monitor your shipments, manage bills of lading, and access key workflows from one central place.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-900">{kpi.value}</p>
                </div>
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <span className="text-lg font-semibold">›</span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{kpi.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Activity</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Recent shipment updates</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                4 new
              </span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Bill of Lading #BOL-1024 approved</p>
                <p className="mt-1 text-slate-600">Consignee instructions confirmed and carrier notified for departure.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">New container manifest created</p>
                <p className="mt-1 text-slate-600">Manifest for shipment CNL-812 has been added to the system.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">ETA updated for vessel “JIHANG SEA”</p>
                <p className="mt-1 text-slate-600">Expected arrival now 2026-08-15 at Chattogram port.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Insights</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Operational highlights</h2>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Top lane</p>
                <p className="mt-1 text-slate-600">Dhaka → Chattogram continues to have the highest volume this week.</p>
              </li>
              <li className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Highest priority shipment</p>
                <p className="mt-1 text-slate-600">Shipment with expiry-sensitive cargo is scheduled for loading tomorrow.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
