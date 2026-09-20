import { apiGet } from "../../../../lib/api-client";
import type { Vendor } from "../types";

export async function getVendorList(token?: string): Promise<Vendor[]> {
  const json = await apiGet<{ data: Vendor[] }>("/vendors", token);
  return json.data || [];
}
