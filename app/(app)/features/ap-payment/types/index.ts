export interface ApPaymentInvoiceLink {
  apInvoiceId: string;
  apInvoiceNumber: string;
  dueAmount: string;
  paidAmount: string;
}

export interface ApPaymentListItem {
  id: string | number;
  vendor_id: string | number;
  ap_payment_number: string | null;
  payment_date: string | null;
  payment_method: string | null;
  bank_account_id: string | number | null;
  reference_number: string | null;
  amount: string | number | null;
  notes: string | null;
  vendor?: { id: string | number; vendor_code: string | null; vendor_name: string | null } | null;
  invoice_links?: Array<{
    id: string | number;
    ap_invoice_id: string | number;
    paid_amount: string | number;
    invoice?: { id: string | number; ap_invoice_number: string | null; invoice_date: string | null } | null;
  }> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApPaymentDetail extends ApPaymentListItem {}

export interface ApPaymentFormData {
  vendorId: string;
  vendorName: string;
  apPaymentNumber: string;
  paymentDate: string;
  paymentMethod: string;
  bankAccountId: string;
  referenceNumber: string;
  amount: string;
  notes: string;
  invoices: ApPaymentInvoiceLink[];
}

export const DEFAULT_PAYMENT_METHODS = [
  "Cash",
  "Cheque",
  "Bank Transfer",
  "TT / Wire Transfer",
  "Pay Order",
  "Online Payment",
];

export function createDefaultApPaymentForm(): ApPaymentFormData {
  return {
    vendorId: "",
    vendorName: "",
    apPaymentNumber: `APP-${new Date().getFullYear()}-0001`,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: "Bank Transfer",
    bankAccountId: "",
    referenceNumber: "",
    amount: "",
    notes: "",
    invoices: [],
  };
}
