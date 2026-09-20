import { apiGet } from "../../../../lib/api-client";
import type { Item } from "../types";

export async function getItemList(token?: string): Promise<Item[]> {
  const json = await apiGet<{ data: Item[] }>("/items", token);
  return json.data || [];
}
