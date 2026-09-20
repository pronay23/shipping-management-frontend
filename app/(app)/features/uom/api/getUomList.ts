import { apiGet } from "../../../../lib/api-client";
import type { Uom } from "../types";

export async function getUomList(token?: string): Promise<Uom[]> {
  const json = await apiGet<{ data: Uom[] }>("/uoms", token);
  return json.data || [];
}
