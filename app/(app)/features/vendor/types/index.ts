export interface VendorCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface Country {
  id: number;
  country_code: string;
  country_name: string;
}

export interface Currency {
  id: number;
  currency_code: string;
  currency_name: string;
  symbol: string;
}

export interface Vendor {
  id: number;
  vendor_code: string;
  vendor_name: string;
  vendor_type: string | null;
  vendor_category_id: number | null;
  country_id: number | null;
  currency_id: number | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  tin_number: string | null;
  vat_registration_number: string | null;
  payment_terms: string | null;
  credit_limit: number;
  status: string;
  created_at: string;
  updated_at: string;
  vendor_category?: VendorCategory | null;
  country?: Country | null;
  currency?: Currency | null;
}

export interface CreateVendorPayload {
  vendor_code: string;
  vendor_name: string;
  vendor_type?: string | null;
  vendor_category_id?: number | null;
  country_id?: number | null;
  currency_id?: number | null;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tin_number?: string | null;
  vat_registration_number?: string | null;
  payment_terms?: string | null;
  credit_limit?: number;
  status?: string;
}

export interface UpdateVendorPayload {
  vendor_code?: string;
  vendor_name?: string;
  vendor_type?: string | null;
  vendor_category_id?: number | null;
  country_id?: number | null;
  currency_id?: number | null;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tin_number?: string | null;
  vat_registration_number?: string | null;
  payment_terms?: string | null;
  credit_limit?: number;
  status?: string;
}
