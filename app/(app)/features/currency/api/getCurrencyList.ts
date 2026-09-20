import { apiGet } from "../../../../lib/api-client";
import type { Currency } from "../types";

export async function getCurrencyList(token?: string): Promise<Currency[]> {
  const json = await apiGet<{ data: Currency[] }>("/currencies", token);
  return json.data || [];
}
