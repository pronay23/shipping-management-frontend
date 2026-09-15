export interface VendorCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorCategoryPayload {
  name: string;
  description?: string | null;
}

export interface UpdateVendorCategoryPayload {
  name?: string;
  description?: string | null;
}
