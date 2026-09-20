import { apiPut } from "../../../../lib/api-client";
import type { Vendor, UpdateVendorPayload } from "../types";

export async function updateVendor(id: number, payload: UpdateVendorPayload, token?: string): Promise<Vendor> {
  const json = await apiPut<{ data: Vendor }>(`/vendors/${id}`, payload, token);
  return json.data;
}
