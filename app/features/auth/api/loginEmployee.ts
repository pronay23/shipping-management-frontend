import type { AuthResponse, LoginPayload } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function loginEmployee(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/employee/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (response.status === 401) {
      message = "Invalid employee ID or password.";
    } else if (response.status === 403) {
      message = "Your account is inactive.";
    } else if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        if (typeof parsed?.message === "string") message = parsed.message;
      } catch {
        message = responseText;
      }
    }
    throw new Error(message);
  }

  return responseText ? JSON.parse(responseText) : ({} as AuthResponse);
}