import { apiGet } from "../../../../lib/api-client";
import type { Country } from "../types";

export async function getCountryList(token?: string): Promise<Country[]> {
  const json = await apiGet<{ data: Country[] }>("/countries", token);
  return json.data || [];
}
