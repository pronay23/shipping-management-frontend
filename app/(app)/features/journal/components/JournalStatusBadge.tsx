import { JOURNAL_STATUS_META, type JournalEntryStatus } from "../types";

interface JournalStatusBadgeProps {
  status: JournalEntryStatus | null;
}

export function JournalStatusBadge({ status }: JournalStatusBadgeProps) {
  if (!status) {
    return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Unknown</span>;
  }

  const meta = JOURNAL_STATUS_META[status];

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.label}</span>;
}