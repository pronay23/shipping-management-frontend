export interface Country {
  id: number;
  country_code: string;
  country_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCountryPayload {
  country_code: string;
  country_name: string;
}

export interface UpdateCountryPayload {
  country_code?: string;
  country_name?: string;
}
