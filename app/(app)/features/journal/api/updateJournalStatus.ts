export interface UpdateJournalStatusResult {
  ok: boolean;
  data: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function updateJournalStatus(
  id: string | number,
  action: "approve" | "void"
): Promise<UpdateJournalStatusResult> {
  const response = await fetch(`${API_BASE_URL}/journal-entries/${id}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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