import { apiDelete } from "../../../../lib/api-client";

export async function deleteVendor(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/vendors/${id}`, token);
}
