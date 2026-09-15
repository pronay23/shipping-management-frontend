export interface Uom {
  id: number;
  uom_name: string;
  uom_description: string | null;
  items_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUomPayload {
  uom_name: string;
  uom_description?: string | null;
}

export interface UpdateUomPayload {
  uom_name?: string;
  uom_description?: string | null;
}
