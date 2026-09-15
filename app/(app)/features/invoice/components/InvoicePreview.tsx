"use client";

import { forwardRef } from "react";
import type { CSSProperties } from "react";

import { formatCurrency, getItemTotalBdt, getItemTotalUsd } from "../lib/invoice";
import type { InvoiceFormData } from "../types";

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

interface InvoicePreviewProps {
  data: InvoiceFormData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(function InvoicePreview(
  { data },
  ref
) {
  const totals = data.items.reduce(
    (acc, item) => {
      const bdt = getItemTotalBdt(item, data.exRate);
      return {
        totalUsd: acc.totalUsd + getItemTotalUsd(item),
        totalBdt: acc.totalBdt + bdt,
      };
    },
    { totalUsd: 0, totalBdt: 0 }
  );

  const shipmentRows: Array<[string, string]> = [
    ["B/L Number", data.blNumber],
    ["Customer's Name", data.customerName],
    ["Vessel", data.vessel],
    ["Voyage", data.voyage],
    ["Registration No.", data.registrationNo],
    ["Container(s)", data.containers],
  ];

  const bankLines = [
    `Account Name: ${data.bankDetails.accountName}`,
    `RD Account No.: ${data.bankDetails.rdAccountNo}`,
    `Bank Name: ${data.bankDetails.bankName}`,
    `Branch Name: ${data.bankDetails.branchName}`,
    `SWIFT Code: ${data.bankDetails.swiftCode}`,
    `Routing No.: ${data.bankDetails.routingNo}`,
    `Address: ${data.bankDetails.address}`,
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

      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}
      >
        <div style={{ fontWeight: "bold", fontSize: "11px" }}>{data.invoiceNumber}</div>
        <div style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "13px" }}>{data.title}</div>
        <div style={{ fontSize: "10px" }}>
          <span style={{ fontWeight: "bold" }}>Date:</span> {data.date}
        </div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.75" }}>
        {shipmentRows.map(([label, value]) => (
          <div key={label}>
            <span style={{ fontWeight: "bold" }}>{label}:</span> <span>{value}</span>
          </div>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
        <thead>
          <tr>
            <th rowSpan={2} style={{ ...thStyle, width: "24%", verticalAlign: "middle" }}>
              Particulars
            </th>
            <th colSpan={2} style={thStyle}>
              Quantity
            </th>
            <th colSpan={2} style={thStyle}>
              Rate
            </th>
            <th colSpan={2} style={thStyle}>
              Total
            </th>
          </tr>
          <tr>
            <th style={thStyle}>20&apos;</th>
            <th style={thStyle}>40&apos;</th>
            <th style={thStyle}>USD</th>
            <th style={thStyle}>BDT</th>
            <th style={thStyle}>USD</th>
            <th style={thStyle}>BDT</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => {
            const usd = getItemTotalUsd(item);
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
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={5}
              style={{ ...cellStyle, fontWeight: "bold", textAlign: "center", backgroundColor: "#f0f0f0" }}
            >
              Total
            </td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
              {totals.totalUsd > 0 ? `$${formatCurrency(totals.totalUsd)}` : ""}
            </td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
              {formatCurrency(totals.totalBdt)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginBottom: "12px", lineHeight: "1.75" }}>
        <div>
          <span style={{ fontWeight: "bold" }}>In Word:</span> {data.inWord}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Exch. Rate:</span> {data.exRate}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Remarks:</span> {data.remarks}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "5px" }}>
          Bank Account Details:
        </div>
        <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.75" }}>
          {bankLines.map((line) => (
            <li key={line} style={{ listStyleType: "disc" }}>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "16px", lineHeight: "1.75" }}>
        <div style={{ fontWeight: "bold", textDecoration: "underline", marginBottom: "5px" }}>Terms:</div>
        <ol style={{ margin: 0, paddingLeft: "18px", lineHeight: "1.75" }}>
          <li>Invoice should be settled by Cheque or pay order or cash.</li>
          <li>
            Any discrepancy should be notified to us in writing within 7 days from the invoice date after which
            NONE will be accepted.
          </li>
        </ol>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#0d9488",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: "12px",
          marginBottom: "16px",
        }}
      >
        This is system invoice. No seal and sign is required.
      </div>

      <div
        style={{
          borderTop: "1px solid #aaa",
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
