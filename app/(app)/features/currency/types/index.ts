export interface Currency {
  id: number;
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCurrencyPayload {
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency?: boolean;
  is_active?: boolean;
}

export interface UpdateCurrencyPayload {
  currency_code?: string;
  currency_name?: string;
  symbol?: string;
  exchange_rate?: number;
  is_base_currency?: boolean;
  is_active?: boolean;
}
