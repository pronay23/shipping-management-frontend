interface InvoiceStatusProps {
  status?: string | null;
  children?: React.ReactNode;
}

const TONES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-amber-100 text-amber-700",
  overdue: "bg-rose-100 text-rose-700",
  draft: "bg-slate-100 text-slate-600",
  saved: "bg-slate-100 text-slate-600",
};

export function InvoiceStatus({ status, children }: InvoiceStatusProps) {
  const key = String(status ?? "").toLowerCase();
  const tone = TONES[key] ?? TONES.saved;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {children}
    </span>
  );
}
