import { apiDelete } from "../../../../lib/api-client";

export async function deleteCountry(id: number, token?: string): Promise<void> {
  await apiDelete<void>(`/countries/${id}`, token);
}
