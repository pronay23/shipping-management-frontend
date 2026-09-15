import type { Uom } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getUomList(): Promise<Uom[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/uoms`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();
  return json.data || [];
}
