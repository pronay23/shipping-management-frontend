"use client";

import type { BillOfLadingListItem } from "../api/getBillOfLadingList";

interface BillOfLadingTableProps {
  bills: BillOfLadingListItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

const columns: Array<{ key: keyof BillOfLadingListItem; label: string }> = [
  { key: "bill_number", label: "Bill Number" },
  { key: "booking_number", label: "Booking Number" },
  { key: "bill_type", label: "Bill Type" },
  { key: "vessel_name", label: "Vessel" },
  { key: "vessel_number", label: "Voyage Number" },
  { key: "registration", label: "Registration" },
  { key: "place_of_receipt", label: "Place of Receipt" },
  { key: "port_of_loading", label: "Port of Loading" },
  { key: "port_of_discharge", label: "Port of Discharge" },
  { key: "place_of_delivery", label: "Place of Delivery" },
  { key: "final_destination", label: "Final Destination" },
  { key: "shipped_on_board_date", label: "Shipped On Board" },
  { key: "free_time_days", label: "Free Time Days" },
  { key: "shipper_name", label: "Shipper" },
  { key: "consignee_name", label: "Consignee" },
  { key: "notify_party", label: "Notify Party" },
  { key: "booking_party", label: "Booking Party" },
  { key: "carrier", label: "Carrier" },
  { key: "delivery_contact", label: "Delivery Contact" },
  { key: "product_name", label: "Product Name" },
  { key: "manufacturer_name", label: "Manufacturer" },
  { key: "country_of_origin", label: "Country of Origin" },
  { key: "mfg_date", label: "Manufacture Date" },
  { key: "exp_date", label: "Expiration Date" },
  { key: "hs_code_import", label: "HS Code Import" },
  { key: "hs_code_export", label: "HS Code Export" },
  { key: "net_weight_per_bag", label: "Net Weight Per Bag" },
  { key: "total_net_weight_mt", label: "Total Net Weight (CBM)" },
  { key: "total_gross_weight_mt", label: "Total Gross Weight (KGS)" },
  { key: "delivery_term_notes", label: "Delivery Term Notes" },
  { key: "proforma_invoice_no", label: "Proforma Invoice No." },
  { key: "proforma_invoice_date", label: "Proforma Invoice Date" },
  { key: "doc_credit_no", label: "Doc Credit No." },
  { key: "doc_credit_date", label: "Doc Credit Date" },
  { key: "irc_old_no", label: "IRC Old No." },
  { key: "irc_new_no", label: "IRC New No." },
  { key: "importer_tin", label: "Importer TIN" },
  { key: "importer_vat", label: "Importer VAT" },
  { key: "freight_terms", label: "Freight Terms" },
  { key: "freight_prepaid_at", label: "Freight Prepaid At" },
  { key: "freight_payable_at", label: "Freight Payable At" },
  { key: "total_local_currency", label: "Total Local Currency" },
  { key: "date_of_issue", label: "Date of Issue" },
  { key: "place_of_issue", label: "Place of Issue" },
  { key: "originals_issued", label: "Originals Issued" },
  { key: "signed_by", label: "Signed By" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

export default function BillOfLadingTable({ bills }: BillOfLadingTableProps) {
  async function fetchBillDetail(billId: string | number) {
    const response = await fetch(`${API_BASE_URL}/bill-of-ladings/${billId}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch bill detail (${response.status})`);
    }

    const data = await response.json();
    return data;
  }

  async function imageUrlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }

  function generatePrintHtml(bill: BillOfLadingListItem, detail: any, logoBase64 = "") {
    const safe = (v: any) => (v === null || v === undefined ? "" : String(v));
    const lineBreak = (value: string | null | undefined) =>
      safe(value).replace(/\n/g, "<br />");

    const containers: any[] = Array.isArray(
      detail.container_manifests ?? detail.containers ?? detail.containerManifests,
    )
      ? (detail.container_manifests ?? detail.containers ?? detail.containerManifests)
      : [];

    /* ── totals ── */
    const totalBags = containers.reduce(
      (sum: number, c: any) => sum + (Number(c.bags ?? 0) || 0), 0,
    );
    const totalGross = containers.reduce(
      (sum: number, c: any) => sum + (Number(c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? 0) || 0), 0,
    );
    const totalMeasure = containers.reduce(
      (sum: number, c: any) => sum + (Number(c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? 0) || 0), 0,
    );

    /* ── weight helpers ── */
    const totalNetKg = bill.total_net_weight_mt != null
      ? (Number(bill.total_net_weight_mt) * 1000).toFixed(0)
      : "";
    const totalGrossKg = bill.total_gross_weight_mt != null
      ? (Number(bill.total_gross_weight_mt) * 1000).toFixed(2)
      : "";

    /* ── description block (goes inside middle column of goods row) ── */
    const descParts: string[] = [];
    if (bill.product_name)
      descParts.push(`<strong>${lineBreak(bill.product_name)}</strong>`);
    if (bill.delivery_term_notes)
      descParts.push(lineBreak(bill.delivery_term_notes));
    if (bill.hs_code_import || bill.hs_code_export)
      descParts.push(`H.S CODE: ${safe(bill.hs_code_import || bill.hs_code_export)}`);
    if (totalNetKg)
      descParts.push(`NET WEIGHT: ${Number(totalNetKg).toLocaleString()} KGS`);
    if (totalGrossKg)
      descParts.push(`GROSS WEIGHT: ${Number(totalGrossKg).toLocaleString(undefined, { minimumFractionDigits: 2 })} KGS`);
    if (bill.proforma_invoice_no)
      descParts.push(`INV NO: ${safe(bill.proforma_invoice_no)}${bill.proforma_invoice_date ? " &nbsp;&nbsp; DATE: " + safe(bill.proforma_invoice_date) : ""}`);
    if (bill.doc_credit_no)
      descParts.push(`PC NO: ${safe(bill.doc_credit_no)}${bill.doc_credit_date ? " &nbsp;&nbsp; DATE: " + safe(bill.doc_credit_date) : ""}`);
    if (bill.irc_new_no || bill.irc_old_no)
      descParts.push(`EXP NO: ${safe(bill.irc_new_no || bill.irc_old_no)}`);
    if (bill.free_time_days)
      descParts.push(`<br/><strong>${safe(bill.free_time_days)} DAYS FREE TIME AT FINAL DESTINATION</strong>`);

    /* ── container manifest plain rows inside description column ── */
    const manifestHtml = containers.length > 0
      ? `<table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:7.5pt;">
          <thead>
            <tr style="font-weight:700; border-bottom:1px solid #999; text-align:left;">
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:22%;">CONT. NO</th>
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:22%;">SEAL NO.</th>
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:11%;">SIZE</th>
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:13%;">TYPE</th>
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:12%;">QTY</th>
              <th style="padding:4px 10px 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:10%;">CMB</th>
              <th style="padding:4px 0 4px 0; text-align:left; font-weight:700; font-size:7.5pt; width:10%;">KGS</th>
            </tr>
          </thead>
          <tbody>
            ${containers.map((c: any) => {
        const gKg = Number(c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? 0);
        const mM3 = Number(c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? 0);
        const bags = Number(c.bags ?? c.Bags ?? 0);
        return `<tr>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${safe(c.container_no ?? c.containerNo)}</td>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${safe(c.seal_no ?? c.sealNo)}</td>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${safe(c.size ?? c.container_size ?? "")}</td>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${safe(c.type ?? c.container_type ?? "FCL/FCL")}</td>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${bags > 0 ? bags.toLocaleString() + " BAGS" : ""}</td>
                <td style="padding:3px 10px 3px 0; text-align:left; white-space:nowrap;">${mM3 > 0 ? mM3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}</td>
                <td style="padding:3px 0 3px 0; text-align:left; white-space:nowrap;">${gKg > 0 ? gKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}</td>
              </tr>`;
      }).join("")}
          </tbody>
        </table>`
      : "";

    const descHtml = descParts.join("<br/>") + manifestHtml;

    /* ── summary values for right columns ── */
    const grossDisplay = totalGross > 0
      ? totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " KGS"
      : (totalGrossKg ? Number(totalGrossKg).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " KGS" : "");

    const measDisplay = totalMeasure > 0
      ? totalMeasure.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " CBM"
      : "";

    const bagsSummary = totalBags > 0 ? `${totalBags.toLocaleString()} BAG(S)` : "";

    const logoHtml = logoBase64
      ? `<img src="${logoBase64}" alt="Jihang Shipping" style="width:100%; height:100%; object-fit:contain; display:block;" />`
      : "";

    /* ── GOODS HEADER ── */
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Bill of Lading - ${safe(bill.bill_number)}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Arial,Helvetica,sans-serif; font-size:9pt; color:#000; background:#fff; }
  .page { width:210mm; min-height:297mm; margin:0 auto; padding:6mm 6mm 8mm; }
  .label { font-size:7pt; color:#444; display:block; margin-bottom:1px; }
  @media print { body{margin:0;} .page{padding:4mm;} }
</style>
</head>
<body>
<div class="page">
 
<!-- ROW 1: Shipper+Consignee (left) | Booking/BL + Jihang info (right) -->
<div style="display:grid; grid-template-columns:1fr 10cm; border:1px solid #000;">
  <div style="display:flex; flex-direction:column; border-right:1px solid #000;">
    <div style="padding:5px 7px; border-bottom:1px solid #000; min-height:75px;">
      <span class="label">Shipper</span>
      <div style="font-size:8pt; font-weight:700; line-height:1.5;">${lineBreak(bill.shipper_name)}</div>
    </div>
    <div style="padding:5px 7px; flex:1; min-height:75px;">
      <span class="label">Consignee</span>
      <div style="font-size:8pt; font-weight:700; line-height:1.5;">${lineBreak(bill.consignee_name)}</div>
    </div>
  </div>
  <div style="display:flex; flex-direction:column; height:100%;">
    <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid #000;">
      <div style="padding:4px 6px; border-right:1px solid #000;">
        <span class="label">Booking No.</span>
        <div style="font-size:8pt; font-weight:700;">${safe(bill.booking_number)}</div>
      </div>
      <div style="padding:4px 6px;">
        <span class="label">B/L No.</span>
        <div style="font-size:10pt; font-weight:900;">${safe(bill.bill_number)}</div>
      </div>
    </div>
    <div style="flex:1; min-height:5.5cm; overflow:hidden;">
      ${logoHtml}
    </div>
  </div>
</div>

<!-- ROW 2: Notify Party | Cargo Delivery -->
<div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #000; border-top:none;">
  <div style="padding:5px 7px; border-right:1px solid #000; min-height:55px;">
    <span class="label">Notify Party</span>
    <div style="font-size:7.5pt; line-height:1.5;">${lineBreak(bill.notify_party)}</div>
  </div>
  <div style="padding:5px 7px; min-height:55px;">
    <span class="label">Cargo Delivery, Please Contact:</span>
    <div style="font-size:7.5pt; line-height:1.5;">${lineBreak(bill.delivery_contact || bill.carrier)}</div>
  </div>
</div>

<!-- ROW 3: Place of Receipt | Port of Loading -->
<div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #000; border-top:none;">
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Place of Receipt</span>
    <div style="font-size:10pt; font-weight:700;">${safe(bill.place_of_receipt)}</div>
  </div>
  <div style="padding:4px 7px;">
    <span class="label">Port of Loading</span>
    <div style="font-size:10pt; font-weight:700;">${safe(bill.port_of_loading)}</div>
  </div>
</div>

<!-- ROW 4: Vessel | Voy No | Port of Discharge | Place of Delivery | Final Dest -->
<div style="display:grid; grid-template-columns:1fr 1fr 1.2fr 1.2fr 1.4fr; border:1px solid #000; border-top:none;">
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Vessel</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.vessel_name)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Voy. No.</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.vessel_number)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Port of Discharge</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.port_of_discharge)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Place of Delivery</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.place_of_delivery)}</div>
  </div>
  <div style="padding:4px 7px;">
    <span class="label">Final Destination (For Merchants Reference Only)</span>
    <div style="font-size:7.5pt;">${safe(bill.final_destination)}</div>
  </div>
</div>

<!-- GOODS HEADER -->
<div style="display:grid; grid-template-columns:15% 55% 15% 15%; border:1px solid #000; border-top:none;">
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700;">Marks &amp; Numbers Container No.</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700;">Quantity &amp; Description of Goods</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700; text-align:center;">Gross Weight Cargo</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700; text-align:center;">Measurement</div>
</div>

<!-- GOODS DATA ROW -->
<div style="display:grid; grid-template-columns:15% 55% 15% 15%; border:1px solid #000; border-top:none; min-height:220px;">
  <div style="padding:5px 7px; font-size:8pt; font-weight:700;">
    SHIPPING MARK<br/><br/>N/M<br/><br/>
    ${bagsSummary ? `<span style="font-weight:400; font-size:7.5pt;">${bagsSummary}</span>` : ""}
  </div>
  <div style="padding:5px 7px; font-size:8pt; line-height:1.6;">
    ${descHtml}
  </div>
  <div style="padding:5px 7px; font-size:8pt; font-weight:700; text-align:center;">
    ${grossDisplay}
  </div>
  <div style="padding:5px 7px; font-size:8pt; font-weight:700; text-align:center;">
    ${measDisplay}
  </div>
</div>

<!-- ABOVE PARTICULARS NOTICE -->
<div style="text-align:center; font-size:7pt; font-weight:700; padding:3px 0; border:1px solid #000; border-top:none; border-bottom:none;">
  ABOVE PARTICULARS DECLARED BY SHIPPER, CARRIER NOT RESPONSIBLE
</div>

<!-- BOTTOM SECTION -->
<table style="width:100%; border-collapse:collapse; font-size:7.5pt; border:1px solid #000;">
  <tbody>
    <tr>
      <td style="width:25%; border:1px solid #000; padding:4px; vertical-align:top; border-left:none;">
        <strong>Freight &amp;Charges (Currency)</strong>
      </td>
      <td style="width:22.5%; border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Prepaid</span><br/>
        <div style="text-align:center; font-weight:900; font-size:11pt; margin-top:6px;">${safe(bill.freight_terms) || "PREPAID"}</div>
      </td>
      <td style="width:22.5%; border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Collect</span>
      </td>
      <td style="width:30%; border:1px solid #000; padding:4px; vertical-align:top; border-right:none;" rowspan="2">
        <span>Signature</span>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:4px; vertical-align:top; border-left:none;">
        <strong>Total in Local Currency</strong><br/>
        <div style="margin-top:2px; font-size:8pt;">${safe(bill.total_local_currency)}</div>
      </td>
      <td style="border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Freight Prepaid at</span><br/>
        <div style="margin-top:2px; font-size:8pt; font-weight:700;">${safe(bill.freight_prepaid_at)}</div>
      </td>
      <td style="border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Freight Collect &amp; Payable at</span><br/>
        <div style="margin-top:2px; font-size:8pt; font-weight:700;">${safe(bill.freight_payable_at)}</div>
      </td>
    </tr>
    <tr>
      <td colspan="3" rowspan="4" style="border:1px solid #000; padding:5px; font-size:6pt; line-height:1.35; vertical-align:top; border-left:none; border-bottom:none;">
        RECEIVED by the Carrier the Goods as specified above in apparent good order and Condition unless otherwise stated, to be transported to such place as agreed, authorized or permitted herein and subject to all the terms and conditions appearing on the front and reserve of this Bill of Lading to which the Merchant agrees by accepting this Bill of Lading, any local privileges and customs notwithstanding.<br/>
        The particulars given below are as stated by the shipper and the weight, measure, quantity, condition, contents, and value of the Goods are unknown to the carrier.<br/>
        In witness whereof one original Bill of Lading has been signed if not otherwise stated above, the same being accomplished the other, if any, to be void. If required by the carrier one original Bill of Lading must be surrendered duly endorsed in exchange for the Goods of delivery order.<br/>
        All Claims and Disputes arising under or in connection with this bill of lading shall be referred to arbitration in Hong Kong with English law to apply.
      </td>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Date of B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.date_of_issue)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Place of B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.place_of_issue)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Number of Original B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.originals_issued)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none; border-bottom:none; min-height:60px;">
        <span>Signed by</span>
        <div style="text-align:right; margin-top:30px; font-weight:700; font-size:8pt;">${safe(bill.signed_by)}</div>
        <div style="text-align:right; margin-top:8px; font-style:italic; font-size:7.5pt;">As agent(s) only</div>
      </td>
    </tr>
  </tbody>
</table>

</div>
</body>
</html>`;
  }

  function generatePage2Html(bill: BillOfLadingListItem, detail: any, logoBase64 = "") {
    /* Page 2 = company header image at top, then the full B/L table identical to page 1 */
    const safe = (v: any) => (v === null || v === undefined ? "" : String(v));
    const lineBreak = (value: string | null | undefined) =>
      safe(value).replace(/\n/g, "<br />");

    const containers: any[] = Array.isArray(
      detail.container_manifests ?? detail.containers ?? detail.containerManifests,
    )
      ? (detail.container_manifests ?? detail.containers ?? detail.containerManifests)
      : [];

    const totalBags = containers.reduce((sum: number, c: any) => sum + (Number(c.bags ?? 0) || 0), 0);
    const totalGross = containers.reduce(
      (sum: number, c: any) => sum + (Number(c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? 0) || 0), 0,
    );
    const totalMeasure = containers.reduce(
      (sum: number, c: any) => sum + (Number(c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? 0) || 0), 0,
    );

    const totalNetKg = bill.total_net_weight_mt != null
      ? (Number(bill.total_net_weight_mt) * 1000).toFixed(0) : "";
    const totalGrossKg = bill.total_gross_weight_mt != null
      ? (Number(bill.total_gross_weight_mt) * 1000).toFixed(2) : "";

    const descParts: string[] = [];
    if (bill.product_name) descParts.push(`<strong>${lineBreak(bill.product_name)}</strong>`);
    if (bill.delivery_term_notes) descParts.push(lineBreak(bill.delivery_term_notes));
    if (bill.hs_code_import || bill.hs_code_export) descParts.push(`H.S CODE: ${safe(bill.hs_code_import || bill.hs_code_export)}`);
    if (totalNetKg) descParts.push(`NET WEIGHT: ${Number(totalNetKg).toLocaleString()} KGS`);
    if (totalGrossKg) descParts.push(`GROSS WEIGHT: ${Number(totalGrossKg).toLocaleString(undefined, { minimumFractionDigits: 2 })} KGS`);
    if (bill.proforma_invoice_no) descParts.push(`INV NO: ${safe(bill.proforma_invoice_no)}${bill.proforma_invoice_date ? " &nbsp;&nbsp; DATE: " + safe(bill.proforma_invoice_date) : ""}`);
    if (bill.doc_credit_no) descParts.push(`PC NO: ${safe(bill.doc_credit_no)}${bill.doc_credit_date ? " &nbsp;&nbsp; DATE: " + safe(bill.doc_credit_date) : ""}`);
    if (bill.irc_new_no || bill.irc_old_no) descParts.push(`EXP NO: ${safe(bill.irc_new_no || bill.irc_old_no)}`);
    if (bill.free_time_days) descParts.push(`<br/><strong>${safe(bill.free_time_days)} DAYS FREE TIME AT FINAL DESTINATION</strong>`);

    const manifestHtml = containers.length > 0
      ? `<table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:7.5pt;">
          <thead>
            <tr style="font-weight:700; border-bottom:1px solid #999; text-align:left;">
              <th style="padding:4px 10px 4px 0; width:22%;">CONT. NO</th>
              <th style="padding:4px 10px 4px 0; width:22%;">SEAL NO.</th>
              <th style="padding:4px 10px 4px 0; width:11%;">SIZE</th>
              <th style="padding:4px 10px 4px 0; width:13%;">TYPE</th>
              <th style="padding:4px 10px 4px 0; width:12%;">QTY</th>
              <th style="padding:4px 10px 4px 0; width:10%;">CMB</th>
              <th style="padding:4px 0; width:10%;">KGS</th>
            </tr>
          </thead>
          <tbody>
            ${containers.map((c: any) => {
        const gKg = Number(c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? 0);
        const mM3 = Number(c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? 0);
        const bags = Number(c.bags ?? c.Bags ?? 0);
        return `<tr>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${safe(c.container_no ?? c.containerNo)}</td>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${safe(c.seal_no ?? c.sealNo)}</td>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${safe(c.size ?? c.container_size ?? "")}</td>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${safe(c.type ?? c.container_type ?? "FCL/FCL")}</td>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${bags > 0 ? bags.toLocaleString() + " BAGS" : ""}</td>
                <td style="padding:3px 10px 3px 0; white-space:nowrap;">${mM3 > 0 ? mM3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}</td>
                <td style="padding:3px 0; white-space:nowrap;">${gKg > 0 ? gKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}</td>
              </tr>`;
      }).join("")}
          </tbody>
        </table>`
      : "";

    const descHtml = descParts.join("<br/>") + manifestHtml;

    const grossDisplay = totalGross > 0
      ? totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " KGS"
      : (totalGrossKg ? Number(totalGrossKg).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " KGS" : "");
    const measDisplay = totalMeasure > 0
      ? totalMeasure.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " CBM" : "";
    const bagsSummary = totalBags > 0 ? `${totalBags.toLocaleString()} BAG(S)` : "";

    const logoHtml = logoBase64
      ? `<img src="${logoBase64}" alt="Jihang Shipping" style="width:100%; max-height:160px; object-fit:contain; display:block; margin: 0 auto;" />`
      : "";

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Bill of Lading Copy - ${safe(bill.bill_number)}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Arial,Helvetica,sans-serif; font-size:9pt; color:#000; background:#fff; }
  .page { width:210mm; min-height:297mm; margin:0 auto; padding:6mm 6mm 8mm; }
  .label { font-size:7pt; color:#444; display:block; margin-bottom:1px; }
  @media print { body{margin:0;} .page{padding:4mm;} }
</style>
</head>
<body>
<div class="page">
<!-- ROW 1: Shipper+Consignee (left) | Booking/BL + Jihang info (right) -->
<div style="display:grid; grid-template-columns:1fr 10cm; border:1px solid #000;">
  <div style="display:flex; flex-direction:column; border-right:1px solid #000;">
    <div style="padding:5px 7px; border-bottom:1px solid #000; min-height:75px;">
      <span class="label">Shipper</span>
      <div style="font-size:8pt; font-weight:700; line-height:1.5;">${lineBreak(bill.shipper_name)}</div>
    </div>
    <div style="padding:5px 7px; flex:1; min-height:75px;">
      <span class="label">Consignee</span>
      <div style="font-size:8pt; font-weight:700; line-height:1.5;">${lineBreak(bill.consignee_name)}</div>
    </div>
  </div>
  <div style="display:flex; flex-direction:column; height:100%;">
    <div style="display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid #000;">
      <div style="padding:4px 6px; border-right:1px solid #000;">
        <span class="label">Booking No.</span>
        <div style="font-size:8pt; font-weight:700;">${safe(bill.booking_number)}</div>
      </div>
      <div style="padding:4px 6px;">
        <span class="label">B/L No.</span>
        <div style="font-size:10pt; font-weight:900;">${safe(bill.bill_number)}</div>
      </div>
    </div>
    <div style="flex:1; min-height:6.5cm; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6px; overflow:hidden;">
      <div style="flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden;">${logoHtml}</div>
      <div style="color:#cc0033; font-size:8pt; font-weight:900; text-align:center; letter-spacing:1px; margin-top:5px;">COPY Non-Negotiable</div>
    </div>
  </div>
</div>

<!-- ROW 2: Notify Party | Cargo Delivery -->
<div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #000; border-top:none;">
  <div style="padding:5px 7px; border-right:1px solid #000; min-height:55px;">
    <span class="label">Notify Party</span>
    <div style="font-size:7.5pt; line-height:1.5;">${lineBreak(bill.notify_party)}</div>
  </div>
  <div style="padding:5px 7px; min-height:55px;">
    <span class="label">Cargo Delivery, Please Contact:</span>
    <div style="font-size:7.5pt; line-height:1.5;">${lineBreak(bill.delivery_contact || bill.carrier)}</div>
  </div>
</div>

<!-- ROW 3: Place of Receipt | Port of Loading -->
<div style="display:grid; grid-template-columns:1fr 1fr; border:1px solid #000; border-top:none;">
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Place of Receipt</span>
    <div style="font-size:10pt; font-weight:700;">${safe(bill.place_of_receipt)}</div>
  </div>
  <div style="padding:4px 7px;">
    <span class="label">Port of Loading</span>
    <div style="font-size:10pt; font-weight:700;">${safe(bill.port_of_loading)}</div>
  </div>
</div>

<!-- ROW 4: Vessel | Voy No | Port of Discharge | Place of Delivery | Final Dest -->
<div style="display:grid; grid-template-columns:1fr 1fr 1.2fr 1.2fr 1.4fr; border:1px solid #000; border-top:none;">
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Vessel</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.vessel_name)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Voy. No.</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.vessel_number)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Port of Discharge</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.port_of_discharge)}</div>
  </div>
  <div style="padding:4px 7px; border-right:1px solid #000;">
    <span class="label">Place of Delivery</span>
    <div style="font-size:8.5pt; font-weight:700;">${safe(bill.place_of_delivery)}</div>
  </div>
  <div style="padding:4px 7px;">
    <span class="label">Final Destination (For Merchants Reference Only)</span>
    <div style="font-size:7.5pt;">${safe(bill.final_destination)}</div>
  </div>
</div>

<!-- GOODS HEADER -->
<div style="display:grid; grid-template-columns:15% 55% 15% 15%; border:1px solid #000; border-top:none;">
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700;">Marks &amp; Numbers Container No.</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700;">Quantity &amp; Description of Goods</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700; text-align:center;">Gross Weight Cargo</div>
  <div style="padding:3px 5px; font-size:7.5pt; font-weight:700; text-align:center;">Measurement</div>
</div>

<!-- GOODS DATA ROW -->
<div style="display:grid; grid-template-columns:15% 55% 15% 15%; border:1px solid #000; border-top:none; min-height:220px;">
  <div style="padding:5px 7px; font-size:8pt; font-weight:700;">
    SHIPPING MARK<br/><br/>N/M<br/><br/>
    ${bagsSummary ? `<span style="font-weight:400; font-size:7.5pt;">${bagsSummary}</span>` : ""}
  </div>
  <div style="padding:5px 7px; font-size:8pt; line-height:1.6;">${descHtml}</div>
  <div style="padding:5px 7px; font-size:8pt; font-weight:700; text-align:center;">${grossDisplay}</div>
  <div style="padding:5px 7px; font-size:8pt; font-weight:700; text-align:center;">${measDisplay}</div>
</div>

<!-- ABOVE PARTICULARS NOTICE -->
<div style="text-align:center; font-size:7pt; font-weight:700; padding:3px 0; border:1px solid #000; border-top:none; border-bottom:none;">
  ABOVE PARTICULARS DECLARED BY SHIPPER, CARRIER NOT RESPONSIBLE
</div>

<!-- BOTTOM SECTION -->
<table style="width:100%; border-collapse:collapse; font-size:7.5pt; border:1px solid #000;">
  <tbody>
    <tr>
      <td style="width:25%; border:1px solid #000; padding:4px; vertical-align:top; border-left:none;">
        <strong>Freight &amp;Charges (Currency)</strong>
      </td>
      <td style="width:22.5%; border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Prepaid</span><br/>
        <div style="text-align:center; font-weight:900; font-size:11pt; margin-top:6px;">${safe(bill.freight_terms) || "PREPAID"}</div>
      </td>
      <td style="width:22.5%; border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Collect</span>
      </td>
      <td style="width:30%; border:1px solid #000; padding:4px; vertical-align:top; border-right:none;" rowspan="2">
        <span>Signature</span>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:4px; vertical-align:top; border-left:none;">
        <strong>Total in Local Currency</strong><br/>
        <div style="margin-top:2px; font-size:8pt;">${safe(bill.total_local_currency)}</div>
      </td>
      <td style="border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Freight Prepaid at</span><br/>
        <div style="margin-top:2px; font-size:8pt; font-weight:700;">${safe(bill.freight_prepaid_at)}</div>
      </td>
      <td style="border:1px solid #000; padding:4px; vertical-align:top;">
        <span>Freight Collect &amp; Payable at</span><br/>
        <div style="margin-top:2px; font-size:8pt; font-weight:700;">${safe(bill.freight_payable_at)}</div>
      </td>
    </tr>
    <tr>
      <td colspan="3" rowspan="4" style="border:1px solid #000; padding:5px; font-size:6pt; line-height:1.35; vertical-align:top; border-left:none; border-bottom:none;">
        RECEIVED by the Carrier the Goods as specified above in apparent good order and Condition unless otherwise stated, to be transported to such place as agreed, authorized or permitted herein and subject to all the terms and conditions appearing on the front and reserve of this Bill of Lading to which the Merchant agrees by accepting this Bill of Lading, any local privileges and customs notwithstanding.<br/>
        The particulars given below are as stated by the shipper and the weight, measure, quantity, condition, contents, and value of the Goods are unknown to the carrier.<br/>
        In witness whereof one original Bill of Lading has been signed if not otherwise stated above, the same being accomplished the other, if any, to be void. If required by the carrier one original Bill of Lading must be surrendered duly endorsed in exchange for the Goods of delivery order.<br/>
        All Claims and Disputes arising under or in connection with this bill of lading shall be referred to arbitration in Hong Kong with English law to apply.
      </td>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Date of B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.date_of_issue)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Place of B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.place_of_issue)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none;">
        <span>Number of Original B(s)/L issued</span><br/>
        <div style="text-align:right; font-weight:700; font-size:8pt; margin-top:2px;">${safe(bill.originals_issued)}</div>
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000; padding:3px 5px; vertical-align:top; border-right:none; border-bottom:none; min-height:60px;">
        <span>Signed by</span>
        <div style="text-align:right; margin-top:30px; font-weight:700; font-size:8pt;">${safe(bill.signed_by)}</div>
        <div style="text-align:right; margin-top:8px; font-style:italic; font-size:7.5pt;">As agent(s) only</div>
      </td>
    </tr>
  </tbody>
</table>

</div>
</body>
</html>`;
  }

  function handlePdf(bill: BillOfLadingListItem) {
    (async () => {
      try {
        const [detail, logoBase64] = await Promise.all([
          fetchBillDetail(bill.id),
          imageUrlToBase64("/jihang-shipping.png"),
        ]);

        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        /** Helper: render HTML in a hidden iframe and return a canvas */
        async function renderToCanvas(html: string): Promise<HTMLCanvasElement> {
          const iframe = document.createElement("iframe");
          iframe.style.position = "fixed";
          iframe.style.top = "-9999px";
          iframe.style.left = "0";
          iframe.style.width = "794px";
          iframe.style.height = "1123px";
          iframe.style.border = "none";
          iframe.style.visibility = "hidden";
          document.body.appendChild(iframe);

          const doc = iframe.contentDocument!;
          doc.open();
          doc.write(html);
          doc.close();

          await new Promise<void>((resolve) => setTimeout(resolve, 600));

          const el = (doc.querySelector(".page") as HTMLElement) ?? doc.body;
          const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            windowWidth: 794,
            width: 794,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
          });

          document.body.removeChild(iframe);
          return canvas;
        }

        /** Add a canvas as a single PDF page (scale-to-fit) */
        function addCanvasToPage(pdf: InstanceType<typeof jsPDF>, canvas: HTMLCanvasElement) {
          const pw = pdf.internal.pageSize.getWidth();
          const ph = pdf.internal.pageSize.getHeight();
          const imgData = canvas.toDataURL("image/png");
          const imgH = (canvas.height * pw) / canvas.width;

          if (imgH <= ph) {
            pdf.addImage(imgData, "PNG", 0, 0, pw, imgH);
          } else {
            const ratio = ph / imgH;
            const sw = pw * ratio;
            pdf.addImage(imgData, "PNG", (pw - sw) / 2, 0, sw, ph);
          }
        }

        /* ── Page 1: full B/L layout ── */
        const page1Canvas = await renderToCanvas(generatePrintHtml(bill, detail, logoBase64));

        /* ── Page 2: copy page with logo at top ── */
        const page2Canvas = await renderToCanvas(generatePage2Html(bill, detail, logoBase64));

        /* ── Build PDF ── */
        const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
        addCanvasToPage(pdf, page1Canvas);
        pdf.addPage();
        addCanvasToPage(pdf, page2Canvas);

        pdf.save(`BOL-${bill.bill_number ?? bill.id}.pdf`);
      } catch (err) {
        try {
          const detail = await fetchBillDetail(bill.id);
          const w = window.open("", "_blank", "noopener,noreferrer,width=1000,height=1200");
          if (!w) { return; }
          w.document.write(generatePrintHtml(bill, detail));
          w.document.close();
          w.focus();
        } catch (e) {
          // ignore
        }
      }
    })();
  }

  const MULTILINE_FIELDS = new Set([
    "shipper_name",
    "consignee_name",
    "notify_party",
    "booking_party",
    "carrier",
    "delivery_contact",
    "delivery_term_notes",
  ]);

  function singleLine(value: string | number | null | undefined) {
    return formatValue(value).replace(/\s+/g, " ").trim();
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[2400px] divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide">
                  {column.label}
                </th>
              ))}
              <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {bills.map((bill) => (
              <tr key={bill.id} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key as string} className="px-3 py-2">
                    {MULTILINE_FIELDS.has(column.key) ? (
                      <span
                        className="block max-w-52 truncate"
                        title={String(bill[column.key] ?? "")}
                      >
                        {singleLine(bill[column.key])}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">{singleLine(bill[column.key])}</span>
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    onClick={() => handlePdf(bill)}
                    className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
