"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Employee } from "../../../features/auth/types";
import { getEmployeeList } from "../api/getEmployeeList";
import { updateEmployee, type UpdateEmployeePayload } from "../api/updateEmployee";

type EditField = Exclude<keyof UpdateEmployeePayload, "status">;

interface FieldConfig {
  key: EditField;
  label: string;
  type?: "text" | "email" | "date";
  textarea?: boolean;
  full?: boolean;
}

const EDIT_FIELDS: FieldConfig[] = [
  { key: "name", label: "Full Name" },
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
  { key: "present_address", label: "Present Address", textarea: true, full: true },
  { key: "personal_address", label: "Personal Address", textarea: true, full: true },
];

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const data = await getEmployeeList();
      setEmployees(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(emp: Employee) {
    setEditingEmployee(emp);
    setEditForm({
      name: emp.name || "",
      department: emp.department || "",
      designation: emp.designation || "",
      official_mobile: emp.official_mobile || "",
      personal_mobile: emp.personal_mobile || "",
      email: emp.email || "",
      nid: emp.nid || "",
      joining_date: emp.joining_date || "",
      bank_account_number: emp.bank_account_number || "",
      birthday: emp.birthday || "",
      image: emp.image || "",
      emergency_person_mobile: emp.emergency_person_mobile || "",
      relationship_with_emergency_person: emp.relationship_with_emergency_person || "",
      present_address: emp.present_address || "",
      personal_address: emp.personal_address || "",
    });
    setEditStatus((emp.status as "active" | "inactive") || "active");
    setSaveError(null);
    setSaveSuccess(null);
    setEditModalOpen(true);
  }

  async function handleSave() {
    if (!editingEmployee) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const payload: UpdateEmployeePayload = {};
      for (const field of EDIT_FIELDS) {
        const value = editForm[field.key]?.trim() || null;
        (payload as Record<string, unknown>)[field.key] = value;
      }
      payload.status = editStatus;

      await updateEmployee(editingEmployee.id, payload);
      setSaveSuccess("Employee updated successfully!");
      await fetchEmployees();
      setTimeout(() => {
        setEditModalOpen(false);
        setSaveSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update employee");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">Loading employees...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
        {error}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No employees found.{" "}
        <Link href="/features/employee/create" className="font-medium text-sky-600 hover:underline">
          Add an employee
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Employee ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Department</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Designation</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Mobile</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                  {emp.employee_id}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{emp.name}</td>
                <td className="px-4 py-3 text-slate-600">{emp.department || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{emp.designation || "-"}</td>
                <td className="px-4 py-3 text-slate-600">{emp.email || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {emp.official_mobile || emp.personal_mobile || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {emp.status === "active" ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                    title="Edit Employee"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                <p className="text-sm text-slate-500">{editingEmployee.employee_id} - {editingEmployee.name}</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {saveError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
                {saveError}
              </div>
            )}

            {saveSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                {saveSuccess}
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {EDIT_FIELDS.map((field) => (
                <label
                  key={field.key}
                  className={`space-y-2 text-sm text-slate-700 ${field.full ? "sm:col-span-2" : ""}`}
                >
                  {field.label}
                  {field.textarea ? (
                    <textarea
                      value={editForm[field.key] || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      rows={3}
                      className={`${inputClass} resize-y`}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={editForm[field.key] || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className={inputClass}
                    />
                  )}
                </label>
              ))}

              <label className="space-y-2 text-sm text-slate-700">
                Status
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
