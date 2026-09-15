"use client";

import { forwardRef } from "react";
import type { CSSProperties } from "react";

import { formatCurrency, getItemTotalBdt, parseNumber } from "../../invoice/lib/invoice";
import type { MoneyReceiptFormData } from "../types";

const cellStyle: CSSProperties = {
  border: "1px solid #000",
  padding: "3px 6px",
  fontSize: "10px",
  color: "#000",
};

const thStyle: CSSProperties = {
  ...cellStyle,
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
};

interface MoneyReceiptPreviewProps {
  data: MoneyReceiptFormData;
}

export const MoneyReceiptPreview = forwardRef<HTMLDivElement, MoneyReceiptPreviewProps>(function MoneyReceiptPreview(
  { data },
  ref
) {
  const itemsTotalUsd = data.items.reduce((sum, item) => sum + parseNumber(item.totalUsd), 0);
  const itemsTotalBdt = data.items.reduce((sum, item) => sum + getItemTotalBdt(item, data.exRate), 0);
  const paidTotal = data.invoices.reduce((sum, invoice) => sum + parseNumber(invoice.paidAmount), 0);

  const invoiceNumbers = data.invoices
    .map((inv) => inv.invoice_number)
    .filter(Boolean)
    .join(", ");

  const shipmentRows: Array<[string, string | null | undefined]> = [
    ["B/L Number", data.blNumber],
    ["Invoice Number", invoiceNumbers],
    ["Vessel", data.vessel],
    ["Voyage", data.voyage],
    ["Registration No.", data.registrationNo],
    ["Container", data.containers],
  ];

  return (
    <div
      ref={ref}
      style={{
        width: "760px",
        minWidth: "760px",
        background: "#ffffff",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "10px",
        color: "#000000",
        padding: "24px 32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "2px solid #1a3b7a",
          paddingBottom: "12px",
          marginBottom: "12px",
        }}
      >
        <img
          src="/bcl-logo.png"
          alt="Bangladesh Container Lines Ltd."
          style={{ height: "60px", width: "auto", maxWidth: "420px", objectFit: "contain" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontWeight: "bold", fontSize: "11px" }}>{data.moneyReceiptNumber}</div>
        <div style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "13px" }}>{data.title}</div>
        <div style={{ fontSize: "10px" }}>
          <span style={{ fontWeight: "bold" }}>Date:</span> {data.moneyReceiptDate}
        </div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.75" }}>
        {shipmentRows.map(([label, value]) =>
          value ? (
            <div key={label}>
              <span style={{ fontWeight: "bold" }}>{label}:</span> <span>{value}</span>
            </div>
          ) : null
        )}
        {data.paymentTerm ? (
          <div>
            <span style={{ fontWeight: "bold" }}>Payment term:</span> {data.paymentTerm}
          </div>
        ) : null}
      </div>

      {data.items.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: "left" }}>Particulars</th>
              <th style={thStyle}>20&apos;</th>
              <th style={thStyle}>40&apos;</th>
              <th style={thStyle}>Rate USD</th>
              <th style={thStyle}>Rate BDT</th>
              <th style={thStyle}>Total USD</th>
              <th style={thStyle}>Total BDT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => {
              const usd = parseNumber(item.totalUsd);
              const bdt = getItemTotalBdt(item, data.exRate);
              return (
                <tr key={item.key}>
                  <td style={{ ...cellStyle, textAlign: "left" }}>{item.label}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>{item.qty20}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>{item.qty40}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>{item.rateUsd}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>{item.rateBdt}</td>
                  <td style={{ ...cellStyle, textAlign: "right" }}>{usd > 0 ? `$${formatCurrency(usd)}` : ""}</td>
                  <td style={{ ...cellStyle, textAlign: "right" }}>
                    {bdt !== 0 ? formatCurrency(bdt) : item.totalUsd ? "0.00" : ""}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                colSpan={5}
                style={{ ...cellStyle, fontWeight: "bold", textAlign: "center", backgroundColor: "#f0f0f0" }}
              >
                Total
              </td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {itemsTotalUsd > 0 ? `$${formatCurrency(itemsTotalUsd)}` : ""}
              </td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                {formatCurrency(itemsTotalBdt)}
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}

      <div style={{ marginBottom: "12px", lineHeight: "1.75" }}>
        <div>
          <span style={{ fontWeight: "bold" }}>Total BDT:</span> {formatCurrency(itemsTotalBdt)}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Paid BDT:</span> {formatCurrency(paidTotal)}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>In Word (BDT):</span> {data.inWord}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Exch. Rate:</span> {data.exRate}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "48px",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Received By</div>
          <div style={{ marginTop: "40px", fontSize: "9px", color: "#333" }}>Signature</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Authorized Signatory</div>
          <div style={{ marginTop: "40px", fontSize: "9px", color: "#333" }}>Signature</div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #aaa",
          marginTop: "24px",
          paddingTop: "8px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "7.5px",
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        <img
          src="/ishat-group.png"
          alt="Ishat Group"
          style={{ width: "44px", height: "44px", objectFit: "contain", flexShrink: 0 }}
        />
        <div>
          <div>
            <strong>Corporate Office:</strong> Flat No-A-8 &amp; B-8, Assurance Lake Arcade, House No-14 Road
            No-137 Gulshan Model Town, Gulshan-01, Dhaka-1212, Bangladesh
          </div>
          <div>
            <strong>Operations Office:</strong> Joy Bangla Tower, 36 Agrabad C/A, Chattogram-4100, Bangladesh
            Cell: +880 1747 640054
          </div>
          <div>
            <strong>Registered Office:</strong> 57 Purana Paltan Line, SEL Trident Tower, Suite-504 (5th Floor),
            Paltan, Dhaka-1000, Bangladesh
          </div>
          <div>
            Contacts Website &amp; E-mail: www.bclmsl.com | info@bclmsl.com &amp; Tel: +88 02 41082445-88 02
          </div>
        </div>
      </div>
    </div>
  );
});