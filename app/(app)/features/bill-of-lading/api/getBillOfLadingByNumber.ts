import { getBillOfLadingList } from "./getBillOfLadingList";
import type { BillOfLadingListItem } from "./getBillOfLadingList";

export async function getBillOfLadingByNumber(
  billNumber: string
): Promise<BillOfLadingListItem | null> {
  const normalized = billNumber.trim().toLowerCase();
  if (!normalized) return null;

  const bills = await getBillOfLadingList();
  return (
    bills.find((bill) => bill.bill_number?.trim().toLowerCase() === normalized) ?? null
  );
}