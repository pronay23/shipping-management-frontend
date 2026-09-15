import type { InvoiceDetail } from "../../invoice/types";
import { getItemTotalBdt, numberToWords, parseNumber } from "../../invoice/lib/invoice";
import type {
  MoneyReceiptFormData,
  MoneyReceiptInvoiceRow,
  MoneyReceiptItemRow,
  MoneyReceiptPayload,
} from "../types";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function generateMoneyReceiptNumber(): string {
  const now = new Date();
  const stamp = `${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(
    now.getSeconds()
  )}`;
  return `MR/BCLL/${now.getFullYear()}/${stamp}`;
}

function toMoneyReceiptItems(invoices: InvoiceDetail[]): MoneyReceiptItemRow[] {
  const rows: MoneyReceiptItemRow[] = [];
  for (const invoice of invoices) {
    const items = invoice.items ?? [];
    if (items.length === 0) {
      rows.push({
        key: `invoice_${invoice.id}`,
        label: "Total Invoice",
        invoiceNumber: invoice.invoice_number,
        qty20: "",
        qty40: "",
        rateUsd: "",
        rateBdt: "",
        totalUsd: invoice.total_usd != null ? String(invoice.total_usd) : "",
      });
      continue;
    }
    for (const item of items) {
      rows.push({
        key: `invoice_${invoice.id}_item_${item.key ?? rows.length}`,
        label: item.label ?? item.key ?? "Item",
        invoiceNumber: invoice.invoice_number,
        qty20: item.qty_20 != null ? String(item.qty_20) : "",
        qty40: item.qty_40 != null ? String(item.qty_40) : "",
        rateUsd: item.rate_usd != null ? String(item.rate_usd) : "",
        rateBdt: item.rate_bdt != null ? String(item.rate_bdt) : "",
        totalUsd: item.total_usd != null ? String(item.total_usd) : "",
      });
    }
  }
  return rows;
}

function toMoneyReceiptInvoices(
  invoices: InvoiceDetail[],
  receivedByInvoice: Record<string, number> = {}
): MoneyReceiptInvoiceRow[] {
  return invoices.map((invoice) => {
    const received = receivedByInvoice[String(invoice.id)];
    let paidAmount: string;
    if (received != null) {
      paidAmount = received > 0 ? String(received) : "";
    } else {
      paidAmount = invoice.total_bdt != null ? String(invoice.total_bdt) : "";
    }
    return {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      bl_number: invoice.bl_number,
      customer_name: invoice.customer_name,
      vessel: invoice.vessel,
      voyage: invoice.voyage,
      total_usd: invoice.total_usd,
      total_bdt: invoice.total_bdt,
      paidAmount,
    };
  });
}
export function buildMoneyReceiptForm(
  invoices: InvoiceDetail[],
  receivedByInvoice?: Record<string, number>,
  initialPaymentTerm?: string
): MoneyReceiptFormData {
  const first = invoices[0];
  const exRate = first?.exchange_rate != null ? String(first.exchange_rate) : "110.00";
  const items = toMoneyReceiptItems(invoices);
  const moneyReceiptInvoices = toMoneyReceiptInvoices(invoices, receivedByInvoice);
  const paidTotal = calculatePaidTotal({ invoices: moneyReceiptInvoices });

  return {
    title: "Money Receipt",
    moneyReceiptNumber: generateMoneyReceiptNumber(),
    moneyReceiptDate: new Date().toISOString().slice(0, 10),
    blNumber: first?.bl_number ?? "",
    customerName: first?.customer_name ?? "",
    vessel: first?.vessel ?? "",
    voyage: first?.voyage ?? "",
    registrationNo: first?.registration_no ?? "",
    containers: first?.containers ?? "",
    exRate,
    inWord: paidTotal > 0 ? numberToWords(paidTotal) : "",
    paymentTerm: initialPaymentTerm || "",
    items,
    invoices: moneyReceiptInvoices,
  };
}export function calculateMoneyReceiptTotals(form: Pick<MoneyReceiptFormData, "items" | "exRate">) {
  const totalUsd = form.items.reduce((sum, item) => sum + parseNumber(item.totalUsd), 0);
  const totalBdt = form.items.reduce((sum, item) => sum + getItemTotalBdt(item, form.exRate), 0);
  return { totalUsd, totalBdt };
}

export function calculatePaidTotal(form: Pick<MoneyReceiptFormData, "invoices">): number {
  return form.invoices.reduce((sum, invoice) => sum + parseNumber(invoice.paidAmount), 0);
}

export function buildMoneyReceiptPayload(form: MoneyReceiptFormData): MoneyReceiptPayload {
  const { totalUsd, totalBdt } = calculateMoneyReceiptTotals(form);

  return {
    title: form.title,
    money_receipt_number: form.moneyReceiptNumber,
    money_receipt_date: form.moneyReceiptDate,
    bl_number: form.blNumber,
    customer_name: form.customerName,
    vessel: form.vessel,
    voyage: form.voyage,
    registration_no: form.registrationNo,
    containers: form.containers,
    exchange_rate: form.exRate,
    amount_in_words: form.inWord,
    total_usd: totalUsd,
    total_bdt: totalBdt,
    payment_term: form.paymentTerm,
    items: form.items.map((item) => ({
      key: item.key,
      label: item.label,
      qty_20: parseNumber(item.qty20),
      qty_40: parseNumber(item.qty40),
      rate_usd: item.rateUsd,
      rate_bdt: item.rateBdt,
      total_usd: item.totalUsd,
    })),
    invoices: form.invoices.map((invoice) => ({
      invoice_id: invoice.id,
      paid_amount: invoice.paidAmount,
    })),
  };
}