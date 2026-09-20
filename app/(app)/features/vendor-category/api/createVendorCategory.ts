import { apiPost } from "../../../../lib/api-client";
import type { VendorCategory, CreateVendorCategoryPayload } from "../types";

export async function createVendorCategory(payload: CreateVendorCategoryPayload, token?: string): Promise<VendorCategory> {
  const json = await apiPost<{ data: VendorCategory }>("/vendor-categories", payload, token);
  return json.data;
}
