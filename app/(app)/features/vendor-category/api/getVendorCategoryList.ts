import { apiGet } from "../../../../lib/api-client";
import type { VendorCategory } from "../types";

export async function getVendorCategoryList(token?: string): Promise<VendorCategory[]> {
  const json = await apiGet<{ data: VendorCategory[] }>("/vendor-categories", token);
  return json.data || [];
}
