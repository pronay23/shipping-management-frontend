"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerEmployee } from "../../features/auth/api/registerEmployee";
import { AuthField } from "../../features/auth/components/AuthField";
import type { EmployeeRegisterPayload } from "../../features/auth/types";
import { useAuth } from "../../features/auth/hooks/useAuth";

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

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<Record<RegisterStringField, string>>(INITIAL_VALUES);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerEmployee(toPayload(values, password));
      await login({ employee_id: values.employee_id.trim(), password });
      router.replace("/features/invoice");
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Unable to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <img src="/bcl-logo.png" alt="Bangladesh Container Lines Ltd." className="h-16 w-auto" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Create account</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Employee Registration</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Fill in your details to create an employee account and sign in immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

        {formError ? (
          <p className="whitespace-pre-line rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-sky-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}