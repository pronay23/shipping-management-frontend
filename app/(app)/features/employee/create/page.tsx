"use client";

import { useEffect, useState } from "react";
import { AuthField } from "../../../../features/auth/components/AuthField";
import { registerEmployee } from "../../../../features/auth/api/registerEmployee";
import { getRoles, type Role } from "../api/getRoles";
import { assignRole } from "../api/assignRole";
import type { EmployeeRegisterPayload } from "../../../../features/auth/types";

type RegisterStringField = Exclude<keyof EmployeeRegisterPayload, "password" | "status">;

interface FieldConfig {
  key: RegisterStringField;
  label: string;
  type?: "text" | "email" | "date";
  required?: boolean;
  textarea?: boolean;
  full?: boolean;
}

const TEXT_FIELDS: FieldConfig[] = [
  { key: "employee_id", label: "Employee ID", required: true },
  { key: "name", label: "Full Name", required: true },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "official_mobile", label: "Official Mobile" },
  { key: "personal_mobile", label: "Personal Mobile" },
  { key: "email", label: "Email", type: "email" },
  { key: "nid", label: "NID" },
  { key: "joining_date", label: "Joining Date", type: "date" },
  { key: "bank_account_number", label: "Bank Account Number" },
  { key: "birthday", label: "Birthday", type: "date" },
  { key: "image", label: "Image URL" },
  { key: "emergency_person_mobile", label: "Emergency Contact Mobile" },
  { key: "relationship_with_emergency_person", label: "Emergency Contact Relationship" },
];

const TEXTAREA_FIELDS: FieldConfig[] = [
  { key: "present_address", label: "Present Address", textarea: true, full: true },
  { key: "personal_address", label: "Personal Address", textarea: true, full: true },
];

const ALL_FIELDS = [...TEXT_FIELDS, ...TEXTAREA_FIELDS];

const INITIAL_VALUES = ALL_FIELDS.reduce(
  (acc, field) => {
    acc[field.key] = "";
    return acc;
  },
  {} as Record<RegisterStringField, string>
);

function toPayload(values: Record<RegisterStringField, string>, password: string): EmployeeRegisterPayload {
  const payload: Record<string, unknown> = {};
  for (const field of ALL_FIELDS) {
    const value = values[field.key].trim();
    payload[field.key] = value === "" ? null : value;
  }
  payload.password = password;
  payload.status = "active";
  return payload as unknown as EmployeeRegisterPayload;
}

export default function CreateEmployeePage() {
  const [values, setValues] = useState<Record<RegisterStringField, string>>(INITIAL_VALUES);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(() => {});
  }, []);

  function setField(key: RegisterStringField, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!values.employee_id.trim()) nextErrors.employee_id = "Employee ID is required.";
    if (!values.name.trim()) nextErrors.name = "Full Name is required.";
    if (values.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await registerEmployee(toPayload(values, password));
      if (selectedRole && result?.employee_id) {
        await assignRole(result.employee_id, { role: selectedRole });
      }
      setSuccessMsg("Employee created successfully!");
      setValues(INITIAL_VALUES);
      setPassword("");
      setConfirmPassword("");
      setSelectedRole("");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Unable to create employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
              Employee Management
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Add New Employee</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Fill in the details below to register a new employee in the system.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {successMsg}
            </div>
          )}

          {formError && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map(({ key, label, type, required }) => (
                <AuthField
                  key={key}
                  label={label}
                  type={type}
                  required={required}
                  value={values[key]}
                  error={errors[key]}
                  onChange={(value) => setField(key, value)}
                />
              ))}
              {TEXTAREA_FIELDS.map(({ key, label, textarea, full }) => (
                <AuthField
                  key={key}
                  label={label}
                  textarea={textarea}
                  full={full}
                  value={values[key]}
                  onChange={(value) => setField(key, value)}
                />
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                label="Password"
                type="password"
                required
                value={password}
                error={errors.password}
                onChange={setPassword}
              />
              <AuthField
                label="Confirm Password"
                type="password"
                required
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <label className="block font-medium">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring"
              >
                <option value="">No Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.display_name || role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                {submitting ? "Creating employee..." : "Create Employee"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
