import type { JournalEntryDetail } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getJournalEntry(id: string | number): Promise<JournalEntryDetail> {
  const response = await fetch(`${API_BASE_URL}/journal-entries/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load journal entry (${response.status}): ${message || response.statusText}`);
  }

  return (await response.json()) as JournalEntryDetail;
}