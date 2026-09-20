import { apiGet } from "../../../../lib/api-client";
import type { JournalEntryDetail } from "../types";

export async function getJournalEntry(id: string | number, token?: string): Promise<JournalEntryDetail> {
  return apiGet<JournalEntryDetail>(`/journal-entries/${id}`, token);
}
