import { apiPost } from "../../../../lib/api-client";
import type { MoneyReceiptPayload } from "../types";

export interface SaveMoneyReceiptResult {
  ok: boolean;
  data: unknown;
}

export async function saveMoneyReceipt(payload: MoneyReceiptPayload, token?: string): Promise<SaveMoneyReceiptResult> {
  const parsedData = await apiPost<unknown>("/money-receipts", payload, token);

  return {
    ok: true,
    data: parsedData,
  };
}
