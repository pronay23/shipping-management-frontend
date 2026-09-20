import { apiGet } from "../../../../lib/api-client";

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

export async function lookupVendorByCode(vendorCode: string, token?: string): Promise<VendorLookup> {
  const body = await apiGet<{ data: VendorLookup }>(`/vendors/lookup?vendor_code=${encodeURIComponent(vendorCode)}`, token);
  return body.data;
}

export async function lookupItemByCode(itemCode: string, token?: string): Promise<ItemLookup> {
  const body = await apiGet<{ data: ItemLookup }>(`/items/lookup?item_code=${encodeURIComponent(itemCode)}`, token);
  return body.data;
}

export interface AccountLookup {
  id: number | string;
  code: string | null;
  name: string | null;
  type: string | null;
  is_active: boolean;
}

export async function lookupAccountByCode(accountCode: string, token?: string): Promise<AccountLookup> {
  const body = await apiGet<{ data: AccountLookup[] }>(`/chart-of-accounts?search=${encodeURIComponent(accountCode)}`, token);
  const accounts = body.data ?? [];
  const match = accounts.find((a) => String(a.code) === String(accountCode));
  if (!match) {
    throw new Error("Account not found");
  }
  return match;
}

export async function fetchAccountsList(token?: string): Promise<AccountLookup[]> {
  const body = await apiGet<{ data: AccountLookup[] }>("/chart-of-accounts", token);
  return (body.data ?? []).filter((a) => a.is_active);
}

export async function getNextApInvoiceNumber(token?: string): Promise<string> {
  const body = await apiGet<{ data: string }>("/ap-invoices/next-number", token);
  return body.data;
}
