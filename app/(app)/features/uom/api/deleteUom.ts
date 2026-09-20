import { apiDelete } from "../../../../lib/api-client";

export async function deleteUom(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/uoms/${id}`, token);
}
