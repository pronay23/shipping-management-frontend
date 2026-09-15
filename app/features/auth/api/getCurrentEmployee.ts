import type { Employee } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getCurrentEmployee(token: string): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employee/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        if (typeof parsed?.message === "string") message = parsed.message;
      } catch {
        message = responseText;
      }
    }
    throw new ApiError(message, response.status);
  }

  return responseText ? JSON.parse(responseText) : ({} as Employee);
}