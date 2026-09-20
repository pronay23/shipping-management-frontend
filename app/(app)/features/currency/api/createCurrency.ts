import { apiPost } from "../../../../lib/api-client";
import type { Currency, CreateCurrencyPayload } from "../types";

export async function createCurrency(payload: CreateCurrencyPayload, token?: string): Promise<Currency> {
  const json = await apiPost<{ data: Currency }>("/currencies", payload, token);
  return json.data;
}
