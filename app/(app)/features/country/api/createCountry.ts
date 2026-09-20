import { apiPost } from "../../../../lib/api-client";
import type { Country, CreateCountryPayload } from "../types";

export async function createCountry(payload: CreateCountryPayload, token?: string): Promise<Country> {
  const json = await apiPost<{ data: Country }>("/countries", payload, token);
  return json.data;
}
