import type { EmployeeRegisterPayload, Employee } from "../types";

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

export async function registerEmployee(payload: EmployeeRegisterPayload): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employee/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(parseErrorMessage(responseText, response.status));
  }

  return responseText ? JSON.parse(responseText) : ({} as Employee);
}