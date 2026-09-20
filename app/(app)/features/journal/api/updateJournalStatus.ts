import { apiPost } from "../../../../lib/api-client";

export interface UpdateJournalStatusResult {
  ok: boolean;
  data: unknown;
}

export async function updateJournalStatus(
  id: string | number,
  action: "approve" | "void",
  token?: string
): Promise<UpdateJournalStatusResult> {
  const parsedData = await apiPost<unknown>(`/journal-entries/${id}/${action}`, {}, token);

  return {
    ok: true,
    data: parsedData,
  };
}
