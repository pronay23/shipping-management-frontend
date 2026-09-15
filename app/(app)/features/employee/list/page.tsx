import EmployeeTable from "../components/EmployeeTable";

export default function EmployeeListPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                Employee Management
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Employees
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                View and manage all registered employees in the system.
              </p>
            </div>
          </div>

          <EmployeeTable />
        </section>
      </div>
    </main>
  );
}
