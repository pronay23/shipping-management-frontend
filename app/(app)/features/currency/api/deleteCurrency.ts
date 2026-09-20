import { apiDelete } from "../../../../lib/api-client";

export async function deleteCurrency(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/currencies/${id}`, token);
}
