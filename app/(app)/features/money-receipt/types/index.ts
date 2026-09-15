export interface MoneyReceiptItemRow {
  key: string;
  label: string;
  invoiceNumber: string | null;
  qty20: string;
  qty40: string;
  rateUsd: string;
  rateBdt: string;
  totalUsd: string;
}

export interface MoneyReceiptInvoiceRow {
  id: string | number;
  invoice_number: string | null;
  invoice_date: string | null;
  bl_number: string | null;
  customer_name: string | null;
  vessel: string | null;
  voyage: string | null;
  total_usd: string | number | null;
  total_bdt: string | number | null;
  paidAmount: string;
}

export interface MoneyReceiptFormData {
  title: string;
  moneyReceiptNumber: string;
  moneyReceiptDate: string;
  blNumber: string;
  customerName: string;
  vessel: string;
  voyage: string;
  registrationNo: string;
  containers: string;
  exRate: string;
  inWord: string;
  paymentTerm: string;
  items: MoneyReceiptItemRow[];
  invoices: MoneyReceiptInvoiceRow[];
}

export type MoneyReceiptStringField = {
  [K in keyof MoneyReceiptFormData]: MoneyReceiptFormData[K] extends string ? K : never;
}[keyof MoneyReceiptFormData];

export interface MoneyReceiptItemPayload {
  key: string | null;
  label: string;
  qty_20: string | number;
  qty_40: string | number;
  rate_usd: string | number;
  rate_bdt: string | number;
  total_usd: string | number;
}

export interface MoneyReceiptInvoicePayload {
  invoice_id: string | number;
  bill_of_lading_id?: string | number | null;
  paid_amount: string | number;
}

export interface MoneyReceiptPayload {
  title: string;
  money_receipt_number: string;
  money_receipt_date: string;
  bl_number: string;
  customer_name: string;
  vessel: string;
  voyage: string;
  registration_no: string;
  containers: string;
  exchange_rate: string | number;
  amount_in_words: string;
  total_usd: string | number;
  total_bdt: string | number;
  payment_term: string;
  items: MoneyReceiptItemPayload[];
  invoices: MoneyReceiptInvoicePayload[];
}

export const DEFAULT_PAYMENT_TERMS = [
  "Cash",
  "Cheque",
  "Pay Order",
  "Bank Transfer",
  "TT / Wire Transfer",
  "Online Payment",
];