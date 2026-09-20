import { apiPut } from "../../../../lib/api-client";
import type { VendorCategory, UpdateVendorCategoryPayload } from "../types";

export async function updateVendorCategory(id: number, payload: UpdateVendorCategoryPayload, token?: string): Promise<VendorCategory> {
  const json = await apiPut<{ data: VendorCategory }>(`/vendor-categories/${id}`, payload, token);
  return json.data;
}
