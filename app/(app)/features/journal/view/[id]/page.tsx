import Link from "next/link";

import { getJournalEntry } from "../../api/getJournalEntry";
import { JournalLinesTable } from "../../components/JournalLinesTable";
import { JournalStatusBadge } from "../../components/JournalStatusBadge";
import { JournalActions } from "../../components/JournalActions";

interface JournalEntryViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function JournalEntryViewPage({ params }: JournalEntryViewPageProps) {
  const { id } = await params;
  const entry = await getJournalEntry(id);

  const sourceLabel =
    entry.source_type === "money_receipt"
      ? "Money Receipt"
      : entry.source_type === "invoice"
        ? "Invoice"
        : "—";
  const sourceHref =
    entry.source_type === "money_receipt"
      ? null
      : entry.source_type === "invoice" && entry.source_id != null
        ? `/features/invoice/view/${String(entry.source_id)}`
        : null;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Journal Entry</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {entry.voucher_number || "Journal voucher"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>{entry.entry_date || "—"}</span>
                <span className="text-slate-300">•</span>
                <span>{sourceLabel}</span>
                {sourceHref ? (
                  <>
                    <span className="text-slate-300">•</span>
                    <Link href={sourceHref} className="font-semibold text-sky-600 hover:underline">
                      View source
                    </Link>
                  </>
                ) : null}
                <span className="text-slate-300">•</span>
                <JournalStatusBadge status={entry.status} />
              </div>
              {entry.memo ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{entry.memo}</p>
              ) : null}
              {entry.voided_at ? (
                <p className="mt-2 text-xs text-slate-500">
                  Voided {entry.voided_at}
                  {entry.voided_by ? ` by ${entry.voided_by}` : ""}
                </p>
              ) : null}
            </div>
            <JournalActions id={entry.id} status={entry.status} />
          </div>

          <JournalLinesTable
            lines={entry.lines}
            totalDebit={entry.total_debit}
            totalCredit={entry.total_credit}
          />
        </section>
      </div>
    </main>
  );
}