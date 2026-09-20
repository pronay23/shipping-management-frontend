import { apiPut } from "../../../../lib/api-client";
import type { Uom, UpdateUomPayload } from "../types";

export async function updateUom(id: number, payload: UpdateUomPayload, token?: string): Promise<Uom> {
  const json = await apiPut<{ data: Uom }>(`/uoms/${id}`, payload, token);
  return json.data;
}
