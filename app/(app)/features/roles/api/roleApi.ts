import { apiGet, apiPost, apiPut, apiDelete } from "../../../../lib/api-client";

export interface Role {
  id: number;
  name: string;
  display_name: string | null;
  description: string | null;
  guard_name: string;
  permissions?: Permission[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PermissionsByModule {
  [module: string]: Permission[];
}

export interface CreateRolePayload {
  name: string;
  display_name: string;
  description?: string;
  permissions: number[];
}

export interface UpdateRolePayload {
  name?: string;
  display_name?: string;
  description?: string;
  permissions?: number[];
}

export async function getRoles(token?: string): Promise<Role[]> {
  const data = await apiGet<unknown>("/roles", token);
  return Array.isArray(data) ? data : [];
}

export async function getRole(id: number, token?: string): Promise<Role> {
  return apiGet<Role>(`/roles/${id}`, token);
}

export async function createRole(payload: CreateRolePayload, token?: string): Promise<{ message: string; role: Role }> {
  return apiPost("/roles", payload, token);
}

export async function updateRole(id: number, payload: UpdateRolePayload, token?: string): Promise<{ message: string; role: Role }> {
  return apiPut(`/roles/${id}`, payload, token);
}

export async function deleteRole(id: number, token?: string): Promise<{ message: string }> {
  return apiDelete(`/roles/${id}`, token);
}

export async function getPermissions(token?: string): Promise<PermissionsByModule> {
  const data = await apiGet<unknown>("/permissions", token);
  return (data && typeof data === "object" && !Array.isArray(data)) ? data as PermissionsByModule : {};
}
