export interface Uom {
  id: number;
  uom_name: string;
  uom_description: string | null;
}

export interface Item {
  id: number;
  item_code: string;
  item_name: string;
  item_type: string | null;
  uom_id: number | null;
  item_prices: number;
  item_taxes: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  uom?: Uom | null;
  created_by_employee?: { id: number; name: string } | null;
}

export interface CreateItemPayload {
  item_code: string;
  item_name: string;
  item_type?: string | null;
  uom_id?: number | null;
  item_prices?: number;
  item_taxes?: number;
}

export interface UpdateItemPayload {
  item_code?: string;
  item_name?: string;
  item_type?: string | null;
  uom_id?: number | null;
  item_prices?: number;
  item_taxes?: number;
}
