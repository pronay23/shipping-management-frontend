"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateJournalStatus } from "../api/updateJournalStatus";
import type { JournalEntryStatus } from "../types";

interface JournalActionsProps {
  id: string | number;
  status: JournalEntryStatus | null;
}

export function JournalActions({ id, status }: JournalActionsProps) {
  const router = useRouter();
  const [action, setAction] = useState<"approve" | "void" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canApprove = status === "draft";
  const canVoid = status === "draft" || status === "approved";
  const isBusy = action !== null;

  async function handleAction(next: "approve" | "void") {
    if (isBusy) return;

    const confirmMessage =
      next === "approve"
        ? "Approve this journal entry? Approved entries are locked and posted to the ledger."
        : "Void this journal entry? A voided entry is reversed from the ledger.";
    if (!window.confirm(confirmMessage)) return;

    setAction(next);
    setError(null);
    try {
      await updateJournalStatus(id, next);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      router.refresh();
      console.error(`Journal entry ${next} failed:`, error);
    } finally {
      setAction(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleAction("approve")}
          disabled={!canApprove || isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action === "approve" ? "Approving..." : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => handleAction("void")}
          disabled={!canVoid || isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action === "void" ? "Voiding..." : "Void Entry"}
        </button>
      </div>
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}