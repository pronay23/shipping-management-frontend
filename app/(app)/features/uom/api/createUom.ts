import { apiPost } from "../../../../lib/api-client";
import type { Uom, CreateUomPayload } from "../types";

export async function createUom(payload: CreateUomPayload, token?: string): Promise<Uom> {
  const json = await apiPost<{ data: Uom }>("/uoms", payload, token);
  return json.data;
}
