import { apiGet } from "../../../../lib/api-client";
import type { VendorCategory } from "../types";

export async function getVendorCategories(token?: string): Promise<VendorCategory[]> {
  try {
    const json = await apiGet<{ data: VendorCategory[] }>("/vendor-categories", token);
    return json.data || [];
  } catch {
    return [];
  }
}
