import { apiPut } from "../../../../lib/api-client";
import type { Item, UpdateItemPayload } from "../types";

export async function updateItem(id: number, payload: UpdateItemPayload, token?: string): Promise<Item> {
  const json = await apiPut<{ data: Item }>(`/items/${id}`, payload, token);
  return json.data;
}
