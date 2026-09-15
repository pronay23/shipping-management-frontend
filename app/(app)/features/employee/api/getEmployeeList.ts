import type { Employee } from "../../../features/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function getEmployeeList(): Promise<Employee[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/employees`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to load employees (${response.status}): ${message || response.statusText}`);
  }

  const rawData = await response.json();

  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData
    .slice()
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const timeOf = (v: Record<string, unknown>) => {
        if (v.created_at) return new Date(String(v.created_at)).getTime() || 0;
        return Number(v.id) || 0;
      };
      return timeOf(b) - timeOf(a);
    })
    .map((item: Record<string, unknown>) => ({
      id: (item.id as string | number) ?? "",
      employee_id: (item.employee_id as string) ?? "",
      name: (item.name as string) ?? "",
      department: item.department as string | null,
      designation: item.designation as string | null,
      official_mobile: item.official_mobile as string | null,
      personal_mobile: item.personal_mobile as string | null,
      email: item.email as string | null,
      image: item.image as string | null,
      nid: item.nid as string | null,
      joining_date: item.joining_date as string | null,
      bank_account_number: item.bank_account_number as string | null,
      birthday: item.birthday as string | null,
      present_address: item.present_address as string | null,
      personal_address: item.personal_address as string | null,
      emergency_person_mobile: item.emergency_person_mobile as string | null,
      relationship_with_emergency_person: item.relationship_with_emergency_person as string | null,
      status: item.status as string | null,
      created_at: item.created_at as string | null,
      updated_at: item.updated_at as string | null,
    }));
}
