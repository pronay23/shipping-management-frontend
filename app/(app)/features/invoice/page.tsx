import { redirect } from "next/navigation";

export default function InvoiceIndexPage() {
  redirect("/features/invoice/list");
}