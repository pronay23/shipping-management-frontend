import { apiPost } from "../../../../lib/api-client";
import type { ContainerRowPayload } from "../types";

export interface BillOfLadingPayload {
  [key: string]: unknown;
  containers?: ContainerRowPayload[];
}

export interface CreateBillOfLadingResult {
  ok: boolean;
  data: unknown;
}

export async function createBillOfLading(payload: BillOfLadingPayload, token?: string): Promise<CreateBillOfLadingResult> {
  const parsedData = await apiPost<unknown>("/bill-of-ladings", payload, token);

  return {
    ok: true,
    data: parsedData,
  };
}
