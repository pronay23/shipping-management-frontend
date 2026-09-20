import { apiPut } from "../../../../lib/api-client";
import type { Currency, UpdateCurrencyPayload } from "../types";

export async function updateCurrency(id: number, payload: UpdateCurrencyPayload, token?: string): Promise<Currency> {
  const json = await apiPut<{ data: Currency }>(`/currencies/${id}`, payload, token);
  return json.data;
}
