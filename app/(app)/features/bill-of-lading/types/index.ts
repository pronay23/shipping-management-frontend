export interface BillOfLadingFormData {
  bookingNo: string;
  blNo: string;
  billType: string;
  vessel: string;
  voyageNo: string;
  placeOfReceipt: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfDelivery: string;
  finalDestination: string;
  shippedOnBoardDate: string;
  freeTimeDays: string;
  shipper: string;
  consignee: string;
  notifyParty: string;
  bookingParty: string;
  carrier: string;
  deliveryContact: string;
  productName: string;
  manufacturer: string;
  countryOfOrigin: string;
  mfgDate: string;
  expDate: string;
  hsCodeImport: string;
  hsCodeExport: string;
  netWeightPerBag: string;
  totalNetWeightMT: string;
  totalGrossWeightMT: string;
  registration: string;
  status: string;
  deliveryTermNote: string;
  proformaInvoiceNo: string;
  proformaInvoiceDate: string;
  docCreditNo: string;
  docCreditDate: string;
  ircOld: string;
  ircNew: string;
  importerTin: string;
  importerVat: string;
  freightTerms: string;
  freightPrepaidAt: string;
  freightPayableAt: string;
  totalLocalCurrency: string;
  dateOfIssue: string;
  placeOfIssue: string;
  originalsIssued: string;
  signedBy: string;
}

export interface ContainerRowData {
  id: number;
  containerNo: string;
  sealNo: string;
  bags: string;
  grossKg: string;
  measureM3: string;
}

export interface ContainerRowPayload {
  container_no: string | null;
  seal_no: string | null;
  bags: number | null;
  gross_kg: number | null;
  measure_m3: number | null;
}
