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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getContainerManifestList(): Promise<ContainerManifestListItem[]> {
  const [manifestResponse, billResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/container-manifests`, { cache: "no-store" }),
    fetch(`${API_BASE_URL}/bill-of-ladings`, { cache: "no-store" }),
  ]);

  if (!manifestResponse.ok) {
    const message = await manifestResponse.text();
    throw new Error(
      `Failed to load container manifests (${manifestResponse.status}): ${message || manifestResponse.statusText}`
    );
  }

  const rawData = await manifestResponse.json();
  if (!Array.isArray(rawData)) {
    return [];
  }

  const billTypeByNumber = new Map<string, string | null>();
  if (billResponse.ok) {
    const rawBills = await billResponse.json();
    if (Array.isArray(rawBills)) {
      for (const bill of rawBills) {
        const billNumber = (bill.bill_number as string | null)?.trim();
        if (billNumber) billTypeByNumber.set(billNumber, (bill.bill_type as string | null) ?? null);
      }
    }
  }

  return rawData
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
