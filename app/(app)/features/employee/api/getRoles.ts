import { apiGet } from "../../../../lib/api-client";

export interface Role {
  id: number;
  name: string;
  display_name: string | null;
  description: string | null;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export async function getRoles(token?: string): Promise<Role[]> {
  const data = await apiGet<unknown>("/roles", token);
  return Array.isArray(data) ? data : [];
}
