const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("shipping_employee_token");
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token: explicitToken, ...fetchOptions } = options;
  const token = explicitToken ?? getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    let errorMessage = `Request failed with status ${response.status}`;
    if (message) {
      try {
        const parsed = JSON.parse(message);
        if (typeof parsed?.message === "string") errorMessage = parsed.message;
      } catch {
        errorMessage = message;
      }
    }
    throw new ApiError(errorMessage, response.status);
  }

  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, { token, cache: "no-store" });
}

export function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function apiPut<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
    token,
  });
}
