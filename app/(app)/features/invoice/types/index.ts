export interface InvoiceItem {
  key: string;
  label: string;
  qty20: string;
  qty40: string;
  rateUsd: string;
  rateBdt: string;
  totalUsd: string;
}

export interface InvoiceBankDetails {
  accountName: string;
  rdAccountNo: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
  routingNo: string;
  address: string;
}

export interface InvoiceFormData {
  title: string;
  invoiceNumber: string;
  date: string;
  blNumber: string;
  customerName: string;
  vessel: string;
  voyage: string;
  registrationNo: string;
  containers: string;
  exRate: string;
  items: InvoiceItem[];
  inWord: string;
  remarks: string;
  bankDetails: InvoiceBankDetails;
}

export type InvoiceStringField = {
  [K in keyof InvoiceFormData]: InvoiceFormData[K] extends string ? K : never;
}[keyof InvoiceFormData];

export interface InvoiceBankDetailsPayload {
  account_name: string;
  rd_account_no: string;
  bank_name: string;
  branch_name: string;
  swift_code: string;
  routing_no: string;
  address: string;
}

export interface InvoiceItemPayload {
  key: string | null;
  label: string;
  qty_20: string | number;
  qty_40: string | number;
  rate_usd: string | number;
  rate_bdt: string | number;
  total_usd: string | number;
}

export interface InvoicePayload {
  title: string;
  invoice_number: string;
  invoice_date: string;
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
  remarks: string;
  bank_details: InvoiceBankDetailsPayload;
  items: InvoiceItemPayload[];
}

export interface InvoiceListItem {
  id: string | number;
  invoice_number: string | null;
  title: string | null;
  invoice_date: string | null;
  customer_name: string | null;
  bl_number: string | null;
  vessel: string | null;
  voyage: string | null;
  total_usd: string | number | null;
  total_bdt: string | number | null;
  remarks?: string | null;
  received_bdt?: number | null;
  due_bdt?: number | null;
  status?: string | null;
  status_label?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InvoiceDetail {
  id: string | number;
  title: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  bl_number: string | null;
  customer_name: string | null;
  vessel: string | null;
  voyage: string | null;
  registration_no: string | null;
  containers: string | null;
  exchange_rate: string | number | null;
  amount_in_words: string | null;
  total_usd: string | number | null;
  total_bdt: string | number | null;
  remarks: string | null;
  bank_details: InvoiceBankDetailsPayload | null;
  items: InvoiceItemPayload[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const DEFAULT_INVOICE_ITEMS: InvoiceItem[] = [
  { key: "doc_fee", label: "DOC Fee", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "admin_fee", label: "Admin Fee", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "cleaning", label: "Cleaning", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "survey", label: "Survey", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "lift_on_20", label: "Lift-On-20'", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "lift_on_40", label: "Lift-On-40'", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "det_20", label: "Det-20'", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "det_40", label: "Det-40'", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "fcl_dg", label: "FCL DG", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
  { key: "misc", label: "Misc.", qty20: "", qty40: "", rateUsd: "", rateBdt: "", totalUsd: "" },
];

export function createEmptyItem(): InvoiceItem {
  return {
    key: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: "New Item",
    qty20: "",
    qty40: "",
    rateUsd: "",
    rateBdt: "",
    totalUsd: "",
  };
}

export function createDefaultInvoiceForm(): InvoiceFormData {
  return {
    title: "Invoice for Import Shipment",
    invoiceNumber: "MR/IMP/BCLL/26",
    date: new Date().toISOString().slice(0, 10),
    blNumber: "",
    customerName: "",
    vessel: "",
    voyage: "",
    registrationNo: "",
    containers: "",
    exRate: "110.00",
    items: DEFAULT_INVOICE_ITEMS.map((item) => ({ ...item })),
    inWord: "",
    remarks: "",
    bankDetails: {
      accountName: "Bangladesh Container Lines Limited",
      rdAccountNo: "0021020013801",
      bankName: "One Bank PLC",
      branchName: "Gulshan-1 Branch",
      swiftCode: "ONEBDDH003",
      routingNo: "165261726",
      address:
        "Richmond Concord, CES-FB/A, Gulshan Avenue, Bir Uttam Mir Shawkat Road, Gulshan-1, Dhaka, Bangladesh",
    },
  };
}
