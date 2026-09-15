import type { ContainerRowPayload } from "../types";

export interface BillOfLadingPayload {
  [key: string]: unknown;
  containers?: ContainerRowPayload[];
}

export interface CreateBillOfLadingResult {
  ok: boolean;
  data: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function createBillOfLading(payload: BillOfLadingPayload): Promise<CreateBillOfLadingResult> {
  const response = await fetch(`${API_BASE_URL}/bill-of-ladings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  let parsedData: unknown = null;

  if (responseText) {
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = responseText;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    if (typeof parsedData === "object" && parsedData !== null) {
      const maybeError = parsedData as { message?: unknown; errors?: Record<string, unknown> };

      if (typeof maybeError.message === "string") {
        errorMessage = maybeError.message;
      } else if (maybeError.errors) {
        errorMessage = Object.values(maybeError.errors)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((value): value is string => typeof value === "string")
          .join(" \n");
      }
    } else if (typeof parsedData === "string" && parsedData) {
      errorMessage = parsedData;
    }

    throw new Error(errorMessage);
  }

  return {
    ok: true,
    data: parsedData,
  };
}
