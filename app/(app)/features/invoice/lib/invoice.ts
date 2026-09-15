import type { InvoiceDetail, InvoiceFormData, InvoiceItem, InvoicePayload } from "../types";
import { createDefaultInvoiceForm } from "../types";

export function parseNumber(value: string): number {
  const number = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export function computeReceivedByInvoice(
  receipts: Array<{ invoices?: Array<{ invoice_id: string | number; paid_amount?: string | number | null }> | null }>
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const receipt of receipts) {
    for (const allocation of receipt.invoices ?? []) {
      const id = String(allocation.invoice_id);
      const paid = parseNumber(allocation.paid_amount != null ? String(allocation.paid_amount) : "0");
      totals[id] = (totals[id] ?? 0) + paid;
    }
  }
  return totals;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function wordsTwoDigits(num: number): string {
  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return TENS[ten] + (unit ? ` ${ONES[unit]}` : "");
}

function wordsThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  let result = "";
  if (hundred) result += `${ONES[hundred]} Hundred`;
  if (rest) result += (result ? " " : "") + wordsTwoDigits(rest);
  return result;
}

export function numberToWords(value: number): string {
  const num = Math.round(value);
  if (num === 0) return "Zero";
  if (num < 0) return `Minus ${numberToWords(-num)}`;

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  let result = "";
  if (crore) result += `${numberToWords(crore)} Crore`;
  if (lakh) result += (result ? " " : "") + `${numberToWords(lakh)} Lac`;
  if (thousand) result += (result ? " " : "") + `${wordsTwoDigits(thousand)} Thousand`;
  if (rest) result += (result ? " " : "") + wordsThreeDigits(rest);
  return result;
}

export function getItemTotalUsd(item: { qty20: string; qty40: string; rateUsd: string }): number {
  const qty20 = parseNumber(item.qty20);
  const qty40 = parseNumber(item.qty40);
  const rateUsd = parseNumber(item.rateUsd);
  const qty = qty20 + qty40;
  if (qty > 0) return qty * rateUsd;
  return rateUsd;
}

export function getItemTotalBdt(
  item: { qty20: string; qty40: string; rateUsd: string; rateBdt: string },
  exRateStr: string
): number {
  const qty = parseNumber(item.qty20) + parseNumber(item.qty40);
  const rateBdt = parseNumber(item.rateBdt);
  const rateUsd = parseNumber(item.rateUsd);
  const exRate = parseNumber(exRateStr);

  if (rateBdt) {
    return qty > 0 ? qty * rateBdt : rateBdt;
  }
  if (rateUsd) {
    return (qty > 0 ? qty * rateUsd : rateUsd) * exRate;
  }
  return 0;
}

export function getInvoiceNumberType(title: string): "EXP" | "IMP" | null {
  const normalized = title.toLowerCase();
  if (normalized.includes("export")) return "EXP";
  if (normalized.includes("import")) return "IMP";
  return null;
}

export function generateNextInvoiceNumber(title: string, existingNumbers: string[]): string {
  const type = getInvoiceNumberType(title);
  if (!type) return "";
  const prefix = `INV/BCLL/${type}/`;
  let max = 0;
  for (const number of existingNumbers) {
    if (number.startsWith(prefix)) {
      const sequence = Number.parseInt(number.slice(prefix.length), 10);
      if (Number.isFinite(sequence) && sequence > max) max = sequence;
    }
  }
  return `${prefix}${String(max + 1).padStart(5, "0")}`;
}

export function calculateTotals(items: InvoiceItem[], exRateStr: string) {
  const totalUsd = items.reduce((sum, item) => sum + getItemTotalUsd(item), 0);
  const totalBdt = items.reduce((sum, item) => sum + getItemTotalBdt(item, exRateStr), 0);
  return { totalUsd, totalBdt };
}

export function buildInvoicePayload(form: InvoiceFormData): InvoicePayload {
  const { totalUsd, totalBdt } = calculateTotals(form.items, form.exRate);
  return {
    title: form.title,
    invoice_number: form.invoiceNumber,
    invoice_date: form.date,
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
    remarks: form.remarks,
    bank_details: {
      account_name: form.bankDetails.accountName,
      rd_account_no: form.bankDetails.rdAccountNo,
      bank_name: form.bankDetails.bankName,
      branch_name: form.bankDetails.branchName,
      swift_code: form.bankDetails.swiftCode,
      routing_no: form.bankDetails.routingNo,
      address: form.bankDetails.address,
    },
    items: form.items.map((item) => ({
      key: item.key,
      label: item.label,
      qty_20: parseNumber(item.qty20),
      qty_40: parseNumber(item.qty40),
      rate_usd: item.rateUsd,
      rate_bdt: item.rateBdt,
      total_usd: getItemTotalUsd(item),
    })),
  };
}

export function toInvoiceFormData(detail: InvoiceDetail): InvoiceFormData {
  const defaults = createDefaultInvoiceForm();
  return {
    title: detail.title ?? "",
    invoiceNumber: detail.invoice_number ?? "",
    date: detail.invoice_date ?? "",
    blNumber: detail.bl_number ?? "",
    customerName: detail.customer_name ?? "",
    vessel: detail.vessel ?? "",
    voyage: detail.voyage ?? "",
    registrationNo: detail.registration_no ?? "",
    containers: detail.containers ?? "",
    exRate: detail.exchange_rate != null ? String(detail.exchange_rate) : "",
    inWord: detail.amount_in_words ?? "",
    remarks: detail.remarks ?? "",
    items: (detail.items ?? []).map((item) => ({
      key: item.key ?? `item_${Math.random().toString(36).slice(2, 7)}`,
      label: item.label ?? "",
      qty20: item.qty_20 != null ? String(item.qty_20) : "",
      qty40: item.qty_40 != null ? String(item.qty_40) : "",
      rateUsd: item.rate_usd != null ? String(item.rate_usd) : "",
      rateBdt: item.rate_bdt != null ? String(item.rate_bdt) : "",
      totalUsd: item.total_usd != null ? String(item.total_usd) : "",
    })),
    bankDetails: detail.bank_details
      ? {
          accountName: detail.bank_details.account_name ?? "",
          rdAccountNo: detail.bank_details.rd_account_no ?? "",
          bankName: detail.bank_details.bank_name ?? "",
          branchName: detail.bank_details.branch_name ?? "",
          swiftCode: detail.bank_details.swift_code ?? "",
          routingNo: detail.bank_details.routing_no ?? "",
          address: detail.bank_details.address ?? "",
        }
      : { ...defaults.bankDetails },
  };
}
