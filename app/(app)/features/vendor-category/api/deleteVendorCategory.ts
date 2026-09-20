import { apiDelete } from "../../../../lib/api-client";

export async function deleteVendorCategory(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/vendor-categories/${id}`, token);
}
