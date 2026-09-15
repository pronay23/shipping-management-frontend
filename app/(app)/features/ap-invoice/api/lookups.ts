const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export interface VendorLookup {
  id: number | string;
  vendor_code: string | null;
  vendor_name: string | null;
  email: string | null;
  phone: string | null;
}

export interface ItemLookup {
  id: number | string;
  item_code: string | null;
  item_name: string | null;
  item_type: string | null;
  item_prices: string | number | null;
  item_taxes: string | number | null;
}

export async function lookupVendorByCode(vendorCode: string): Promise<VendorLookup> {
  const url = `${API_BASE_URL}/vendors/lookup?vendor_code=${encodeURIComponent(vendorCode)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error("Vendor not found");
  }
  const body = (await response.json()) as { data: VendorLookup };
  return body.data;
}

export async function lookupItemByCode(itemCode: string): Promise<ItemLookup> {
  const url = `${API_BASE_URL}/items/lookup?item_code=${encodeURIComponent(itemCode)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error("Item not found");
  }
  const body = (await response.json()) as { data: ItemLookup };
  return body.data;
}

export interface AccountLookup {
  id: number | string;
  code: string | null;
  name: string | null;
  type: string | null;
  is_active: boolean;
}

export async function lookupAccountByCode(accountCode: string): Promise<AccountLookup> {
  const url = `${API_BASE_URL}/chart-of-accounts?search=${encodeURIComponent(accountCode)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error("Account not found");
  }
  const body = (await response.json()) as { data: AccountLookup[] };
  const accounts = body.data ?? [];
  const match = accounts.find((a) => String(a.code) === String(accountCode));
  if (!match) {
    throw new Error("Account not found");
  }
  return match;
}

export async function fetchAccountsList(): Promise<AccountLookup[]> {
  const url = `${API_BASE_URL}/chart-of-accounts`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error("Failed to load accounts");
  }
  const body = (await response.json()) as { data: AccountLookup[] };
  return (body.data ?? []).filter((a) => a.is_active);
}

export async function getNextApInvoiceNumber(): Promise<string> {
  const url = `${API_BASE_URL}/ap-invoices/next-number`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error("Failed to generate invoice number");
  }
  const body = (await response.json()) as { data: string };
  return body.data;
}
