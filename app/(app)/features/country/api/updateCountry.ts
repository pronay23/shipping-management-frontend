import { apiPut } from "../../../../lib/api-client";
import type { Country, UpdateCountryPayload } from "../types";

export async function updateCountry(id: number, payload: UpdateCountryPayload, token?: string): Promise<Country> {
  const json = await apiPut<{ data: Country }>(`/countries/${id}`, payload, token);
  return json.data;
}
