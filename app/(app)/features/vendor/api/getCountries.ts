import { apiGet } from "../../../../lib/api-client";
import type { Country } from "../types";

export async function getCountries(token?: string): Promise<Country[]> {
  try {
    const json = await apiGet<{ data: Country[] }>("/countries", token);
    return json.data || [];
  } catch {
    return [];
  }
}
