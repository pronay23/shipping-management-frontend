export interface ApInvoiceItem {
  id?: string | number;
  account_id: string | number;
  description: string;
  quantity: string | number;
  unit_price: string | number;
  total_bdt: string | number;
  notes?: string | null;
}

export interface ApInvoiceListItem {
  id: string | number;
  vendor_id: string | number;
  ap_invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  reference: string | null;
  description: string | null;
  total_bdt: string | number | null;
  discount_amount: string | number | null;
  tax_amount: string | number | null;
  net_amount: string | number | null;
  paid_amount: string | number | null;
  due_amount: string | number | null;
  status: string | null;
  notes: string | null;
  vendor?: { id: string | number; vendor_code: string | null; vendor_name: string | null } | null;
  items?: ApInvoiceItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApInvoiceDetail extends ApInvoiceListItem {
  payment_links?: Array<{
    id: string | number;
    ap_payment_id: string | number;
    paid_amount: string | number;
    payment?: { id: string | number; ap_payment_number: string | null; payment_date: string | null; payment_method: string | null } | null;
  }> | null;
}

export interface ApInvoiceFormData {
  vendorId: string;
  vendorCode: string;
  vendorName: string;
  apInvoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  reference: string;
  description: string;
  discountAmount: string;
  taxAmount: string;
  notes: string;
  items: ApInvoiceFormItem[];
}

export interface ApInvoiceFormItem {
  key: string;
  itemCode: string;
  accountId: string;
  accountName: string;
  description: string;
  quantity: string;
  unitPrice: string;
  totalBdt: string;
  notes: string;
}

export function createEmptyApInvoiceItem(): ApInvoiceFormItem {
  return {
    key: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    itemCode: "",
    accountId: "",
    accountName: "",
    description: "",
    quantity: "1",
    unitPrice: "",
    totalBdt: "",
    notes: "",
  };
}

export function createDefaultApInvoiceForm(): ApInvoiceFormData {
  return {
    vendorId: "",
    vendorCode: "",
    vendorName: "",
    apInvoiceNumber: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    reference: "",
    description: "",
    discountAmount: "0",
    taxAmount: "0",
    notes: "",
    items: [createEmptyApInvoiceItem()],
  };
}
