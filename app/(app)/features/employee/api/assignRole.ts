import { apiPut } from "../../../../lib/api-client";

export interface AssignRolePayload {
  role: string;
}

export async function assignRole(
  employeeId: string | number,
  payload: AssignRolePayload,
  token?: string
): Promise<{ message: string; employee: unknown }> {
  return apiPut(`/employees/${employeeId}/role`, payload, token);
}
