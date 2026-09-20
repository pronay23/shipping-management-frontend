import { apiGet } from "../../../../lib/api-client";

export interface ContainerManifestListItem {
  id: string | number;
  bill_of_lading_id: string | number | null;
  bill_number: string | null;
  bill_type: string | null;
  container_no: string | null;
  seal_no: string | null;
  bags: number | null;
  gross_weight_kgs: number | null;
  measurement_m3: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getContainerManifestList(token?: string): Promise<ContainerManifestListItem[]> {
  const [rawManifests, rawBills] = await Promise.all([
    apiGet<unknown>("/container-manifests", token),
    apiGet<unknown>("/bill-of-ladings", token),
  ]);

  if (!Array.isArray(rawManifests)) {
    return [];
  }

  const billTypeByNumber = new Map<string, string | null>();
  if (Array.isArray(rawBills)) {
    for (const bill of rawBills) {
      const billNumber = (bill.bill_number as string | null)?.trim();
      if (billNumber) billTypeByNumber.set(billNumber, (bill.bill_type as string | null) ?? null);
    }
  }

  return rawManifests
  .slice()
  .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
    const timeOf = (v: Record<string, unknown>) => {
      if (v.created_at) return new Date(String(v.created_at)).getTime() || 0;
      if (v.updated_at) return new Date(String(v.updated_at)).getTime() || 0;
      return Number(v.id) || 0;
    };
    return timeOf(b) - timeOf(a);
  })
  .map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    bill_of_lading_id: (item.bill_of_lading_id as string | number | null) ?? null,
    bill_number: item.bill_number as string | null,
    bill_type: (item.bill_type as string | null) ?? billTypeByNumber.get(String(item.bill_number ?? "").trim()) ?? null,
    container_no: item.container_no as string | null,
    seal_no: item.seal_no as string | null,
    bags: typeof item.bags === "number" ? item.bags : item.bags ? Number(item.bags) : null,
    gross_weight_kgs: typeof item.gross_weight_kgs === "number" ? item.gross_weight_kgs : item.gross_weight_kgs ? Number(item.gross_weight_kgs) : null,
    measurement_m3: typeof item.measurement_m3 === "number" ? item.measurement_m3 : item.measurement_m3 ? Number(item.measurement_m3) : null,
    created_at: item.created_at as string | null,
    updated_at: item.updated_at as string | null,
  }));
}
