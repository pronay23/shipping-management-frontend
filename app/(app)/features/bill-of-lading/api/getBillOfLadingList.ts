import { apiGet } from "../../../../lib/api-client";

export interface BillOfLadingListItem {
  id: string | number;
  bill_number: string | null;
  booking_number: string | null;
  bill_type: string | null;
  vessel_name: string | null;
  vessel_number: string | null;
  registration: string | null;
  place_of_receipt: string | null;
  port_of_loading: string | null;
  port_of_discharge: string | null;
  place_of_delivery: string | null;
  final_destination: string | null;
  shipped_on_board_date: string | null;
  free_time_days: string | null;
  shipper_name: string | null;
  consignee_name: string | null;
  notify_party: string | null;
  booking_party: string | null;
  carrier: string | null;
  delivery_contact: string | null;
  product_name: string | null;
  manufacturer_name: string | null;
  country_of_origin: string | null;
  mfg_date: string | null;
  exp_date: string | null;
  hs_code_import: string | null;
  hs_code_export: string | null;
  net_weight_per_bag: number | null;
  total_net_weight_mt: number | null;
  total_gross_weight_mt: number | null;
  delivery_term_notes: string | null;
  proforma_invoice_no: string | null;
  proforma_invoice_date: string | null;
  doc_credit_no: string | null;
  doc_credit_date: string | null;
  irc_old_no: string | null;
  irc_new_no: string | null;
  importer_tin: string | null;
  importer_vat: string | null;
  freight_terms: string | null;
  freight_prepaid_at: string | null;
  freight_payable_at: string | null;
  total_local_currency: number | null;
  date_of_issue: string | null;
  place_of_issue: string | null;
  originals_issued: string | null;
  signed_by: string | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getBillOfLadingList(token?: string): Promise<BillOfLadingListItem[]> {
  const rawData = await apiGet<unknown>("/bill-of-ladings", token);

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData
  .slice()
  .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
    const timeOf = (v: Record<string, unknown>) => {
      if (v.created_at) return new Date(String(v.created_at)).getTime() || 0;
      if (v.updated_at) return new Date(String(v.updated_at)).getTime() || 0;
      return Number(v.id) || 0;
    };
    return timeOf(b) - timeOf(a);
  })
  .map((item: Record<string, unknown>) => ({
    id: (item.id as string | number) ?? "",
    bill_number: item.bill_number as string | null,
    booking_number: item.booking_number as string | null,
    bill_type: item.bill_type as string | null,
    vessel_name: item.vessel_name as string | null,
    vessel_number: item.vessel_number as string | null,
    registration: item.registration as string | null,
    place_of_receipt: item.place_of_receipt as string | null,
    port_of_loading: item.port_of_loading as string | null,
    port_of_discharge: item.port_of_discharge as string | null,
    place_of_delivery: item.place_of_delivery as string | null,
    final_destination: item.final_destination as string | null,
    shipped_on_board_date: item.shipped_on_board_date as string | null,
    free_time_days: item.free_time_days as string | null,
    shipper_name: item.shipper_name as string | null,
    consignee_name: item.consignee_name as string | null,
    notify_party: item.notify_party as string | null,
    booking_party: item.booking_party as string | null,
    carrier: item.carrier as string | null,
    delivery_contact: item.delivery_contact as string | null,
    product_name: item.product_name as string | null,
    manufacturer_name: item.manufacturer_name as string | null,
    country_of_origin: item.country_of_origin as string | null,
    mfg_date: item.mfg_date as string | null,
    exp_date: item.exp_date as string | null,
    hs_code_import: item.hs_code_import as string | null,
    hs_code_export: item.hs_code_export as string | null,
    net_weight_per_bag: item.net_weight_per_bag as number | null,
    total_net_weight_mt: item.total_net_weight_mt as number | null,
    total_gross_weight_mt: item.total_gross_weight_mt as number | null,
    delivery_term_notes: item.delivery_term_notes as string | null,
    proforma_invoice_no: item.proforma_invoice_no as string | null,
    proforma_invoice_date: item.proforma_invoice_date as string | null,
    doc_credit_no: item.doc_credit_no as string | null,
    doc_credit_date: item.doc_credit_date as string | null,
    irc_old_no: item.irc_old_no as string | null,
    irc_new_no: item.irc_new_no as string | null,
    importer_tin: item.importer_tin as string | null,
    importer_vat: item.importer_vat as string | null,
    freight_terms: item.freight_terms as string | null,
    freight_prepaid_at: item.freight_prepaid_at as string | null,
    freight_payable_at: item.freight_payable_at as string | null,
    total_local_currency: item.total_local_currency as number | null,
    date_of_issue: item.date_of_issue as string | null,
    place_of_issue: item.place_of_issue as string | null,
    originals_issued: item.originals_issued as string | null,
    signed_by: item.signed_by as string | null,
    status: item.status as string | null,
    created_at: item.created_at as string | null,
    updated_at: item.updated_at as string | null,
  }));
}
