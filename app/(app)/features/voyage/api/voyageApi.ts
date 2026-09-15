const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export interface ContainerManifest {
  id?: string | number;
  container_no: string;
  seal_no: string;
  bags: string | null;
  gross_weight_kgs: string | null;
  type_of_container: string | null;
  status: string | null;
  commodity_code: string | null;
}

export interface BillOfLading {
  id?: string | number;
  bill_number: string;
  bol_nature: string | null;
  bol_type_code: string | null;
  consolidated_cargo: string | null;
  port_of_loading: string | null;
  port_of_discharge: string | null;
  shipping_agent_code: string | null;
  shipping_agent_name: string | null;
  exporter_name: string | null;
  exporter_address: string | null;
  notify_code: string | null;
  notify_name: string | null;
  notify_address: string | null;
  consignee_code: string | null;
  consignee_name: string | null;
  consignee_address: string | null;
  package_type_code: string | null;
  shipping_marks: string | null;
  product_name: string | null;
  volume_in_cubic_meters: string | null;
  freight_value: string | null;
  freight_currency: string | null;
  containers?: ContainerManifest[];
}

export interface Voyage {
  id: string | number;
  vessel_name: string;
  voyage_number: string;
  port_of_loading: string | null;
  port_of_discharge: string | null;
  arrival_date: string | null;
  departure_date: string | null;
  status: string;
  customs_office_code?: string | null;
  carrier_code?: string | null;
  carrier_name?: string | null;
  carrier_address?: string | null;
  mode_of_transport_code?: string | null;
  nationality_of_transporter_code?: string | null;
  bols?: BillOfLading[];
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getVoyageList(): Promise<Voyage[]> {
  const response = await fetch(`${API_BASE_URL}/voyages`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load voyages (${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createVoyage(payload: Omit<Voyage, "id" | "created_at" | "updated_at">): Promise<Voyage> {
  const response = await fetch(`${API_BASE_URL}/voyages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message ?? `Failed to create voyage (${response.status})`);
  }
  return response.json();
}
