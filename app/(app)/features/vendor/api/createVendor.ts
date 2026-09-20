import { apiPost } from "../../../../lib/api-client";
import type { Vendor, CreateVendorPayload } from "../types";

export async function createVendor(payload: CreateVendorPayload, token?: string): Promise<Vendor> {
  const json = await apiPost<{ data: Vendor }>("/vendors", payload, token);
  return json.data;
}
