"use client";

import { useMemo, useState } from "react";
import { createBillOfLading } from "../api/createBillOfLading";
import type { BillOfLadingFormData, ContainerRowData } from "../types";

const initialForm: BillOfLadingFormData = {
  bookingNo: "",
  blNo: "",
  billType: "",
  vessel: "",
  voyageNo: "",
  placeOfReceipt: "",
  portOfLoading: "",
  portOfDischarge: "",
  placeOfDelivery: "",
  finalDestination: "",
  shippedOnBoardDate: "",
  freeTimeDays: "",
  shipper: "",
  consignee: "",
  notifyParty: "",
  bookingParty: "",
  carrier: "",
  deliveryContact: "",
  productName: "",
  manufacturer: "",
  countryOfOrigin: "",
  mfgDate: "",
  expDate: "",
  hsCodeImport: "",
  hsCodeExport: "",
  netWeightPerBag: "",
  totalNetWeightMT: "",
  totalGrossWeightMT: "",
  registration: "",
  status: "",
  deliveryTermNote: "",
  proformaInvoiceNo: "",
  proformaInvoiceDate: "",
  docCreditNo: "",
  docCreditDate: "",
  ircOld: "",
  ircNew: "",
  importerTin: "",
  importerVat: "",
  freightTerms: "Prepaid",
  freightPrepaidAt: "",
  freightPayableAt: "",
  totalLocalCurrency: "",
  dateOfIssue: "",
  placeOfIssue: "",
  originalsIssued: "",
  signedBy: "",
};

const createEmptyRow = (id: number): ContainerRowData => ({
  id,
  containerNo: "",
  sealNo: "",
  bags: "",
  grossKg: "",
  measureM3: "",
});

const sampleRows: ContainerRowData[] = [
  { id: 1, containerNo: "TRLU9335018", sealNo: "20'DC/1-050594", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
  { id: 2, containerNo: "TRLU9271546", sealNo: "20'DC/1-050541", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
  { id: 3, containerNo: "TCKU3261190", sealNo: "20'DC/1-050595", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
  { id: 4, containerNo: "MOAU0607780", sealNo: "20'DC/1-050596", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
  { id: 5, containerNo: "TCKU3119041", sealNo: "20'DC/1-050598", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
  { id: 6, containerNo: "TCKU3301626", sealNo: "20'DC/1-050599", bags: "500", grossKg: "25080.000", measureM3: "25.000" },
];

const sampleForm: BillOfLadingFormData = {
  bookingNo: "BKHJ260200008",
  blNo: "BKHJ260200008",
  billType: "Import",
  vessel: "EVER URBAN",
  voyageNo: "223W",
  placeOfReceipt: "LAT KRABANG",
  portOfLoading: "LAEM CHABANG",
  portOfDischarge: "CHATTOGRAM (CHITTAGONG) PORT",
  placeOfDelivery: "CHATTOGRAM (CHITTAGONG) PORT",
  finalDestination: "",
  shippedOnBoardDate: "2026-03-04",
  freeTimeDays: "14 DAYS",
  shipper: "SIAM SUGAR EXPORT CORPORATION LIMITED\n26TH FLOOR TRR TOWER 238 NARADHIWAS RAJANAGARINDRA ROAD, CHONG NONSI, YANNAWA, BANGKOK 10120 THAILAND\nTEL: 02 294 5588  TAX ID: 0105527026208",
  consignee: "TO THE ORDER OF JAMUNA BANK PLC.,\nGULSHAN CORPORATE BRANCH, HEAD OFFICE,\nPLOT: 14, BLOCK: C, BIR UTTAM, A.K. KHANDAKER ROAD,\nGULSHAN-1, DHAKA-1212, BANGLADESH",
  notifyParty: "PRIME PUSTI LIMITED\nUTTOR MOMINPUR, RANGPUR SADAR, RANGPUR, BANGLADESH\nAND JAMUNA BANK PLC., GULSHAN CORPORATE BRANCH,\nHEAD OFFICE, PLOT: 14, BLOCK: C, BIR UTTAM, A.K. KHANDAKER ROAD",
  bookingParty: "",
  carrier: "HONGKONG JIHANG INTERNATIONAL SHIPPING COMPANY LIMITED\nUnit A, 35F, Montery Plaza 15 Chong Yip Street, Kwun Tong, KL\nmng@jihangshipping.com",
  deliveryContact: "BANGLADESH CONTAINER LINES LTD.\n36, JOY BANGLA TOWER 12TH FLOOR, AGRABAD C/A, CHATTOGRAM, BANGLADESH\nPHONE: +880 241082445 / 241082446 / 2333313029",
  productName: "REFINED SUGAR",
  manufacturer: "PHITSANULOK SUGAR CO., LTD.",
  countryOfOrigin: "THAILAND",
  mfgDate: "2026-01-01",
  expDate: "2028-01-01",
  hsCodeImport: "1701.99.00",
  hsCodeExport: "1701.99.10",
  netWeightPerBag: "50",
  totalNetWeightMT: "250.0000",
  totalGrossWeightMT: "250.8000",
  registration: "",
  status: "draft",
  deliveryTermNote: "CFR, CHATTOGRAM SEA PORT, BANGLADESH (INCOTERM 2020). Description, quality, quantity and all other details are as per beneficiary's proforma invoice.",
  proformaInvoiceNo: "21-26020002-25",
  proformaInvoiceDate: "2026-02-03",
  docCreditNo: "305726020007",
  docCreditDate: "2026-02-16",
  ircOld: "BA-0232211",
  ircNew: "260385120000219",
  importerTin: "335990448797",
  importerVat: "000383876-1001",
  freightTerms: "Prepaid",
  freightPrepaidAt: "FREIGHT PREPAID",
  freightPayableAt: "",
  totalLocalCurrency: "",
  dateOfIssue: "2026-03-04",
  placeOfIssue: "Bangkok, Thailand",
  originalsIssued: "3",
  signedBy: "As Agent for the carrier",
};

export default function BillOfLadingForm() {
  const [formData, setFormData] = useState<BillOfLadingFormData>(initialForm);
  const [rows, setRows] = useState<ContainerRowData[]>([createEmptyRow(1)]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.bags += Number(row.bags) || 0;
        acc.gross += Number(row.grossKg) || 0;
        acc.measure += Number(row.measureM3) || 0;
        return acc;
      },
      { bags: 0, gross: 0, measure: 0 }
    );
  }, [rows]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateRow = (id: number, field: keyof ContainerRowData, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow(Date.now())]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const billNumber = (formData.blNo || formData.bookingNo || `BL-${Date.now()}`).trim();

    const containers = rows
      .filter((row) => row.containerNo || row.sealNo || row.bags || row.grossKg || row.measureM3)
      .map(({ id, containerNo, sealNo, bags, grossKg, measureM3 }) => ({
        container_no: containerNo?.trim() || null,
        seal_no: sealNo?.trim() || null,
        bags: bags ? Number(bags) : null,
        gross_kg: grossKg ? Number(grossKg) : null,
        measure_m3: measureM3 ? Number(measureM3) : null,
        bill_type: formData.billType?.trim() || null,
      }));

    const payload = {
      bill_number: billNumber || `BL-${Date.now()}`,
      bill_type: formData.billType?.trim() || null,
      booking_number: formData.bookingNo?.trim() || null,
      vessel_name: formData.vessel?.trim() || null,
      vessel_number: formData.voyageNo?.trim() || null,
      place_of_receipt: formData.placeOfReceipt?.trim() || null,
      port_of_loading: formData.portOfLoading?.trim() || null,
      port_of_discharge: formData.portOfDischarge?.trim() || null,
      place_of_delivery: formData.placeOfDelivery?.trim() || null,
      final_destination: formData.finalDestination?.trim() || null,
      shipped_on_board_date: formData.shippedOnBoardDate?.trim() || null,
      free_time_days: formData.freeTimeDays?.trim() || null,
      shipper_name: formData.shipper?.trim() || null,
      consignee_name: formData.consignee?.trim() || null,
      notify_party: formData.notifyParty?.trim() || null,
      booking_party: formData.bookingParty?.trim() || null,
      carrier: formData.carrier?.trim() || null,
      delivery_contact: formData.deliveryContact?.trim() || null,
      product_name: formData.productName?.trim() || null,
      manufacturer_name: formData.manufacturer?.trim() || null,
      country_of_origin: formData.countryOfOrigin?.trim() || null,
      mfg_date: formData.mfgDate?.trim() || null,
      exp_date: formData.expDate?.trim() || null,
      hs_code_import: formData.hsCodeImport?.trim() || null,
      hs_code_export: formData.hsCodeExport?.trim() || null,
      net_weight_per_bag: formData.netWeightPerBag ? Number(formData.netWeightPerBag) : null,
      total_net_weight_mt: formData.totalNetWeightMT ? Number(formData.totalNetWeightMT) : null,
      total_gross_weight_mt: formData.totalGrossWeightMT ? Number(formData.totalGrossWeightMT) : null,
      registration: formData.registration?.trim() || null,
      delivery_term_notes: formData.deliveryTermNote?.trim() || null,
      proforma_invoice_no: formData.proformaInvoiceNo?.trim() || null,
      proforma_invoice_date: formData.proformaInvoiceDate?.trim() || null,
      doc_credit_no: formData.docCreditNo?.trim() || null,
      doc_credit_date: formData.docCreditDate?.trim() || null,
      irc_old_no: formData.ircOld?.trim() || null,
      irc_new_no: formData.ircNew?.trim() || null,
      importer_tin: formData.importerTin?.trim() || null,
      importer_vat: formData.importerVat?.trim() || null,
      freight_terms: formData.freightTerms?.trim() || null,
      freight_prepaid_at: formData.freightPrepaidAt?.trim() || null,
      freight_payable_at: formData.freightPayableAt?.trim() || null,
      total_local_currency: formData.totalLocalCurrency ? Number(formData.totalLocalCurrency) : null,
      date_of_issue: formData.dateOfIssue?.trim() || null,
      place_of_issue: formData.placeOfIssue?.trim() || null,
      originals_issued: formData.originalsIssued?.trim() || null,
      signed_by: formData.signedBy?.trim() || null,
      status: formData.status?.trim() || "draft",
      containers,
    };

    try {
      const result = await createBillOfLading(payload);

      console.log("Bill of Lading entry saved:", payload, result.data);
      setMessage("Entry saved successfully.");
      setFormData(initialForm);
      setRows([createEmptyRow(1)]);
    } catch (error) {
      console.error("Failed to save bill of lading entry:", error);
      setMessage(error instanceof Error ? `Failed to save entry: ${error.message}` : "Failed to save entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    const payload = {
      ...formData,
      containers: rows.map(({ id, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.blNo || "bill-of-lading"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("JSON exported successfully.");
  };

  const handleReset = () => {
    setFormData(initialForm);
    setRows([createEmptyRow(1)]);
    setMessage("");
  };

  const loadSample = () => {
    setFormData(sampleForm);
    setRows(sampleRows);
    setMessage("Sample document data loaded.");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#16212B]">
      <header className="border-b border-[#D8D0BC] bg-[#0B2542] text-[#F1F5F9] print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F1F5F9] bg-transparent font-mono text-sm font-semibold">
              B/L
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight">Bill of Lading — Manifest Entry</h1>
              <p className="font-mono text-xs text-[#B9C6D6]">Ocean / Combined Transport · ref. BKHJ260200008</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSample} className="rounded border border-[#B9C6D6] px-3 py-2 text-xs transition hover:bg-white/10">
              Load sample
            </button>
            <button type="button" onClick={handleReset} className="rounded border border-[#B9C6D6] px-3 py-2 text-xs transition hover:bg-white/10">
              Clear all
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
                01
              </div>
              <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">Reference & Voyage</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["bookingNo", "Booking No.", "text", "BKHJ260200008"],
                ["blNo", "B/L No.", "text", "BKHJ260200008"],
                ["billType", "Bill Type", "select", "Import"],
                ["vessel", "Vessel", "text", "EVER URBAN"],
                ["voyageNo", "Voyage No.", "text", "223W"],
                ["placeOfReceipt", "Place of Receipt", "text", "LAT KRABANG"],
                ["portOfLoading", "Port of Loading", "text", "LAEM CHABANG"],
                ["portOfDischarge", "Port of Discharge", "text", "CHATTOGRAM (CHITTAGONG) PORT"],
                ["placeOfDelivery", "Place of Delivery", "text", "CHATTOGRAM (CHITTAGONG) PORT"],
                ["finalDestination", "Final Destination", "text", ""],
                ["shippedOnBoardDate", "Shipped on Board Date", "date", ""],
                ["freeTimeDays", "Free Time at Destination", "text", "14 DAYS"],
              ].map(([name, label, type, placeholder]) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">{label}</span>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name as keyof BillOfLadingFormData]}
                      onChange={handleChange}
                      className="w-full cursor-pointer border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                    >
                      <option value="">Select</option>
                      <option value="Export">Export</option>
                      <option value="Import">Import</option>
                    </select>
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={formData[name as keyof BillOfLadingFormData]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
                02
              </div>
              <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">Parties</h2>
            </div>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
              {[
                ["shipper", "Shipper", "Company name, address, TEL, TAX ID"],
                ["consignee", "Consignee", "To the order of..."],
                ["notifyParty", "Notify Party", ""],
                ["bookingParty", "Booking Party", ""],
                ["carrier", "Carrier / Shipping Line", "Name, address, email"],
                ["deliveryContact", "Cargo Delivery Contact", "Agent name, address, phone, email"],
              ].map(([name, label, placeholder]) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">{label}</span>
                  <textarea
                    name={name}
                    value={formData[name as keyof BillOfLadingFormData]}
                    onChange={handleChange}
                    rows={4}
                    placeholder={placeholder}
                    className="min-h-[6rem] w-full resize-y border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
                03
              </div>
              <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">Cargo & Product Detail</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["productName", "Product Description", "text", "REFINED SUGAR"],
                ["manufacturer", "Manufacturer", "text", "PHITSANULOK SUGAR CO., LTD."],
                ["countryOfOrigin", "Country of Origin", "text", "THAILAND"],
                ["mfgDate", "Manufacturing Date", "date", ""],
                ["expDate", "Expiry Date", "date", ""],
                ["hsCodeImport", "HS Code (Import)", "text", "1701.99.00"],
                ["hsCodeExport", "HS Code (Export)", "text", "1701.99.10"],
                ["netWeightPerBag", "Net Weight/Bag (KGS)", "number", "50"],
                ["totalNetWeightMT", "Total Net Weight (CBM)", "number", ""],
                ["totalGrossWeightMT", "Total Gross Weight (KGS)", "number", ""],
                ["registration", "Registration", "text", ""],
                ["status", "Status", "select", ""],
              ].map(([name, label, type, placeholder]) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">{label}</span>
                  {type === "select" && name === "status" ? (
                    <select
                      name={name}
                      value={formData[name as keyof BillOfLadingFormData]}
                      onChange={handleChange}
                      className="w-full cursor-pointer border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                    >
                      <option value="">Select Status</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="b_l_drafted">B/L Drafted</option>
                      <option value="draft_sent">Draft Sent</option>
                      <option value="draft_approved">Draft Approved</option>
                      <option value="b_l_issued">B/L Issued</option>
                      <option value="b_l_amended">B/L Amended</option>
                      <option value="surrendered">Surrendered</option>
                      <option value="telex_released">Telex Released</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="closed">Closed</option>
                    </select>
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={formData[name as keyof BillOfLadingFormData]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-5 grid gap-5 border-t border-dashed border-[#D8D0BC] pt-5 md:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Cargo / Delivery Term Note</span>
                <textarea
                  name="deliveryTermNote"
                  value={formData.deliveryTermNote}
                  onChange={handleChange}
                  rows={4}
                  placeholder="CFR, CHATTOGRAM SEA PORT, BANGLADESH (INCOTERM 2020)…"
                  className="min-h-[4.2rem] w-full resize-y border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["proformaInvoiceNo", "Beneficiary Proforma Invoice No.", "text", "21-26020002-25"],
                  ["proformaInvoiceDate", "Proforma Invoice Date", "date", ""],
                  ["docCreditNo", "Documentary Credit No.", "text", "305726020007"],
                  ["docCreditDate", "Documentary Credit Date", "date", ""],
                ].map(([name, label, type, placeholder]) => (
                  <label key={name} className="block text-sm">
                    <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">{label}</span>
                    <input
                      name={name}
                      type={type}
                      value={formData[name as keyof BillOfLadingFormData]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
                  04
                </div>
                <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">Container Manifest</h2>
              </div>
              <button type="button" onClick={addRow} className="rounded border border-[#0B2542] px-3 py-2 text-xs font-medium text-[#0B2542] transition hover:bg-[#0B2542] hover:text-[#F1F5F9]">
                + Add container row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0B2542] text-left">
                    <th className="w-8 px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">#</th>
                    <th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Container No.</th>
                    <th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Seal No.</th>
                    <th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Bags</th>
                    <th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Gross Wt (KGS)</th>
                    <th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Measurement (M3)</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} className="border-b border-[#D8D0BC] transition-colors hover:bg-[#EDE8DA]">
                      <td className="px-2 py-2 font-mono text-xs text-[#3E6990]">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-2 py-2">
                        <input
                          value={row.containerNo}
                          onChange={(event) => updateRow(row.id, "containerNo", event.target.value)}
                          placeholder="TRLU9335018"
                          className="w-full border-0 border-b border-transparent bg-transparent px-0 py-1 font-mono text-[0.92rem] outline-none transition hover:border-[#D8D0BC] focus:border-[#B9662E]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={row.sealNo}
                          onChange={(event) => updateRow(row.id, "sealNo", event.target.value)}
                          placeholder="20'DC/1-050594"
                          className="w-full border-0 border-b border-transparent bg-transparent px-0 py-1 font-mono text-[0.92rem] outline-none transition hover:border-[#D8D0BC] focus:border-[#B9662E]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={row.bags}
                          onChange={(event) => updateRow(row.id, "bags", event.target.value)}
                          placeholder="500"
                          className="w-full border-0 border-b border-transparent bg-transparent px-0 py-1 font-mono text-[0.92rem] outline-none transition hover:border-[#D8D0BC] focus:border-[#B9662E]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.001"
                          value={row.grossKg}
                          onChange={(event) => updateRow(row.id, "grossKg", event.target.value)}
                          placeholder="25080.000"
                          className="w-full border-0 border-b border-transparent bg-transparent px-0 py-1 font-mono text-[0.92rem] outline-none transition hover:border-[#D8D0BC] focus:border-[#B9662E]"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.001"
                          value={row.measureM3}
                          onChange={(event) => updateRow(row.id, "measureM3", event.target.value)}
                          placeholder="25.000"
                          className="w-full border-0 border-b border-transparent bg-transparent px-0 py-1 font-mono text-[0.92rem] outline-none transition hover:border-[#D8D0BC] focus:border-[#B9662E]"
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <button type="button" onClick={() => removeRow(row.id)} className="text-xs font-medium text-[#B9662E] transition hover:text-[#7A3B18]">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#0B2542] font-semibold font-mono">
                    <td className="px-2 py-2" colSpan={3}>Total ({rows.length} containers)</td>
                    <td className="px-2 py-2">{totals.bags.toLocaleString()}</td>
                    <td className="px-2 py-2">{totals.gross.toFixed(3)}</td>
                    <td className="px-2 py-2">{totals.measure.toFixed(3)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#3E6990]">Document totals — {totals.bags.toLocaleString()} bags · {totals.gross.toFixed(3)} KGS · {totals.measure.toFixed(3)} CBM.</p>
          </section>

          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
                05
              </div>
              <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">Freight & Issuance</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <label className="block text-sm">
                <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Freight Terms</span>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="freightTerms" value="Prepaid" checked={formData.freightTerms === "Prepaid"} onChange={handleChange} />
                    Prepaid
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="freightTerms" value="Collect" checked={formData.freightTerms === "Collect"} onChange={handleChange} />
                    Collect
                  </label>
                </div>
              </label>
              {[
                ["freightPrepaidAt", "Freight Prepaid At", "text", "FREIGHT PREPAID"],
                ["freightPayableAt", "Freight Payable At", "text", ""],
                ["totalLocalCurrency", "Total in Local Currency", "text", ""],
                ["dateOfIssue", "Date of B(s)/L Issued", "date", ""],
                ["placeOfIssue", "Place of B(s)/L Issued", "text", "Bangkok, Thailand"],
                ["originalsIssued", "No. of Original B(s)/L Issued", "text", "3"],
                ["signedBy", "Signed By", "text", "As Agent for the carrier"],
              ].map(([name, label, type, placeholder]) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">{label}</span>
                  <input
                    name={name}
                    type={type}
                    value={formData[name as keyof BillOfLadingFormData]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
            <button type="button" onClick={handleExport} className="rounded border border-[#0B2542] px-5 py-2.5 text-sm font-medium text-[#0B2542] transition hover:bg-[#0B2542] hover:text-[#F1F5F9]">
              Export JSON
            </button>
            <button type="button" onClick={() => window.print()} className="rounded bg-[#B9662E] px-5 py-2.5 text-sm font-medium text-[#FFF9F0] transition hover:bg-[#9E5423]">
              Print / Save PDF
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-[#0B2542] px-5 py-2.5 text-sm font-medium text-[#F1F5F9] transition hover:bg-[#123058] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save entry"}
            </button>
          </div>

          {message ? (
            <div className="rounded border border-[#D8D0BC] bg-white/80 px-4 py-3 text-sm text-[#0B2542] print:hidden">
              {message}
            </div>
          ) : null}
        </form>
      </main>
    </div>
  );
}
