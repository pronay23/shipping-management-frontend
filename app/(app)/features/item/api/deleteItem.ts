import { apiDelete } from "../../../../lib/api-client";

export async function deleteItem(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/items/${id}`, token);
}
