export interface Employee {
  id: string | number;
  employee_id: string;
  name: string;
  department: string | null;
  designation: string | null;
  official_mobile: string | null;
  personal_mobile: string | null;
  email: string | null;
  image: string | null;
  nid: string | null;
  joining_date: string | null;
  bank_account_number: string | null;
  birthday: string | null;
  present_address: string | null;
  personal_address: string | null;
  emergency_person_mobile: string | null;
  relationship_with_emergency_person: string | null;
  status: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EmployeeRegisterPayload {
  employee_id: string;
  name: string;
  department: string | null;
  designation: string | null;
  official_mobile: string | null;
  personal_mobile: string | null;
  email: string | null;
  image: string | null;
  nid: string | null;
  joining_date: string | null;
  bank_account_number: string | null;
  birthday: string | null;
  present_address: string | null;
  personal_address: string | null;
  emergency_person_mobile: string | null;
  relationship_with_emergency_person: string | null;
  password: string;
  status: "active" | "inactive";
}

export interface LoginPayload {
  employee_id: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  employee: Employee;
}