import { apiPut } from "../../../../lib/api-client";
import type { Employee } from "../../../../features/auth/types";

export interface UpdateEmployeePayload {
  name?: string;
  department?: string | null;
  designation?: string | null;
  official_mobile?: string | null;
  personal_mobile?: string | null;
  email?: string | null;
  image?: string | null;
  nid?: string | null;
  joining_date?: string | null;
  bank_account_number?: string | null;
  birthday?: string | null;
  present_address?: string | null;
  personal_address?: string | null;
  emergency_person_mobile?: string | null;
  relationship_with_emergency_person?: string | null;
  status?: "active" | "inactive";
}

export async function updateEmployee(id: string | number, payload: UpdateEmployeePayload, token?: string): Promise<Employee> {
  return apiPut<Employee>(`/employees/${id}`, payload, token);
}
