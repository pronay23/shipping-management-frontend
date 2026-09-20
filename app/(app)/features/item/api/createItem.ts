import { apiPost } from "../../../../lib/api-client";
import type { Item, CreateItemPayload } from "../types";

export async function createItem(payload: CreateItemPayload, token?: string): Promise<Item> {
  const json = await apiPost<{ data: Item }>("/items", payload, token);
  return json.data;
}
