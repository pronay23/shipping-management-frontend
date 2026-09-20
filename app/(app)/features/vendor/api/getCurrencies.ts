import { apiGet } from "../../../../lib/api-client";
import type { Currency } from "../types";

export async function getCurrencies(token?: string): Promise<Currency[]> {
  try {
    const json = await apiGet<{ data: Currency[] }>("/currencies", token);
    return json.data || [];
  } catch {
    return [];
  }
}
