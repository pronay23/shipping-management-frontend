import type { Employee } from "../../../features/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

function parseErrorMessage(responseText: string, status: number): string {
  if (!responseText) return `Request failed with status ${status}`;
  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    return responseText;
  }
  if (typeof parsed === "string" && parsed) return parsed;
  if (typeof parsed === "object" && parsed !== null) {
    const body = parsed as { message?: unknown; errors?: Record<string, unknown> };
    if (typeof body.message === "string") return body.message;
    if (body.errors) {
      const messages = Object.values(body.errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === "string");
      if (messages.length > 0) return messages.join("\n");
    }
  }
  return `Request failed with status ${status}`;
}

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

export async function updateEmployee(id: string | number, payload: UpdateEmployeePayload): Promise<Employee> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(parseErrorMessage(responseText, response.status));
  }

  return responseText ? JSON.parse(responseText) : ({} as Employee);
}
