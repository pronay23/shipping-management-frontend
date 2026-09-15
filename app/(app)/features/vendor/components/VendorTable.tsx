"use client";

import { useEffect, useState } from "react";
import type { Vendor, VendorCategory, Country, Currency } from "../types";
import { getVendorList } from "../api/getVendorList";
import { updateVendor } from "../api/updateVendor";
import { deleteVendor } from "../api/deleteVendor";
import { getVendorCategories } from "../api/getVendorCategories";
import { getCountries } from "../api/getCountries";
import { getCurrencies } from "../api/getCurrencies";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    Promise.all([getVendorCategories(), getCountries(), getCurrencies()]).then(
      ([cats, cos, cur]) => {
        setCategories(cats);
        setCountries(cos);
        setCurrencies(cur);
      }
    );
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getVendorList();
      setVendors(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(vendor: Vendor) {
    setEditingVendor(vendor);
    setEditForm({
      vendor_code: vendor.vendor_code,
      vendor_name: vendor.vendor_name,
      vendor_type: vendor.vendor_type || "",
      vendor_category_id: vendor.vendor_category_id ?? null,
      country_id: vendor.country_id ?? null,
      currency_id: vendor.currency_id ?? null,
      contact_person: vendor.contact_person || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      tin_number: vendor.tin_number || "",
      vat_registration_number: vendor.vat_registration_number || "",
      payment_terms: vendor.payment_terms || "",
      credit_limit: vendor.credit_limit ?? 0,
      status: vendor.status || "active",
    });
    setSaveError(null);
    setEditModalOpen(true);
  }

  function setField(key: string, value: unknown) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpdate() {
    if (!editingVendor) return;
    if (!String(editForm.vendor_code || "").trim() || !String(editForm.vendor_name || "").trim()) {
      setSaveError("Vendor code and name are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateVendor(editingVendor.id, {
        vendor_code: String(editForm.vendor_code).trim(),
        vendor_name: String(editForm.vendor_name).trim(),
        vendor_type: String(editForm.vendor_type || "").trim() || null,
        vendor_category_id: editForm.vendor_category_id ? Number(editForm.vendor_category_id) : null,
        country_id: editForm.country_id ? Number(editForm.country_id) : null,
        currency_id: editForm.currency_id ? Number(editForm.currency_id) : null,
        contact_person: String(editForm.contact_person || "").trim() || null,
        email: String(editForm.email || "").trim() || null,
        phone: String(editForm.phone || "").trim() || null,
        address: String(editForm.address || "").trim() || null,
        tin_number: String(editForm.tin_number || "").trim() || null,
        vat_registration_number: String(editForm.vat_registration_number || "").trim() || null,
        payment_terms: String(editForm.payment_terms || "").trim() || null,
        credit_limit: Number(editForm.credit_limit) || 0,
        status: String(editForm.status),
      });
      setSuccessMsg("Vendor updated successfully!");
      await fetchData();
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update vendor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(vendor: Vendor) {
    if (!confirm(`Are you sure you want to delete "${vendor.vendor_name}"?`)) return;
    try {
      await deleteVendor(vendor.id);
      setSuccessMsg("Vendor deleted successfully!");
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete vendor");
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">Loading vendors...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
        {error}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No vendors found.{" "}
        <a href="/features/vendor/create" className="font-medium text-sky-600 hover:underline">
          Add a vendor
        </a>
      </div>
    );
  }

  return (
    <>
      {successMsg && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Code</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Country</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Contact</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Phone</th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50 transition">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                  {vendor.vendor_code}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px] truncate">
                  {vendor.vendor_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vendor.vendor_type || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vendor.vendor_category?.name || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vendor.country ? `${vendor.country.country_name}` : "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vendor.contact_person || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {vendor.phone || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  {vendor.status === "active" ? (
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
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(vendor)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                      title="Edit Vendor"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(vendor)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Vendor"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Vendor</h2>
                <p className="text-sm text-slate-500">{editingVendor.vendor_code} - {editingVendor.vendor_name}</p>
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

            <div className="mt-4 space-y-4">
              {/* Basic */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Vendor Code <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={String(editForm.vendor_code || "")} onChange={(e) => setField("vendor_code", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Vendor Name <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={String(editForm.vendor_name || "")} onChange={(e) => setField("vendor_name", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Vendor Type</label>
                  <select value={String(editForm.vendor_type || "")} onChange={(e) => setField("vendor_type", e.target.value)} className={`mt-1 ${inputClass}`}>
                    <option value="">Select type</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Agent">Agent</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Category</label>
                  <select value={String(editForm.vendor_category_id ?? "")} onChange={(e) => setField("vendor_category_id", e.target.value ? Number(e.target.value) : null)} className={`mt-1 ${inputClass}`}>
                    <option value="">Select category</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Country</label>
                  <select value={String(editForm.country_id ?? "")} onChange={(e) => setField("country_id", e.target.value ? Number(e.target.value) : null)} className={`mt-1 ${inputClass}`}>
                    <option value="">Select country</option>
                    {countries.map((c) => (<option key={c.id} value={c.id}>{c.country_name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Currency</label>
                  <select value={String(editForm.currency_id ?? "")} onChange={(e) => setField("currency_id", e.target.value ? Number(e.target.value) : null)} className={`mt-1 ${inputClass}`}>
                    <option value="">Select currency</option>
                    {currencies.map((c) => (<option key={c.id} value={c.id}>{c.currency_name} ({c.currency_code})</option>))}
                  </select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Contact Person</label>
                  <input type="text" value={String(editForm.contact_person || "")} onChange={(e) => setField("contact_person", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Email</label>
                  <input type="email" value={String(editForm.email || "")} onChange={(e) => setField("email", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Phone</label>
                  <input type="text" value={String(editForm.phone || "")} onChange={(e) => setField("phone", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Address</label>
                <textarea rows={2} value={String(editForm.address || "")} onChange={(e) => setField("address", e.target.value)} className={`mt-1 ${inputClass} resize-y`} />
              </div>

              {/* Legal & Financial */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">TIN Number</label>
                  <input type="text" value={String(editForm.tin_number || "")} onChange={(e) => setField("tin_number", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">VAT Reg. Number</label>
                  <input type="text" value={String(editForm.vat_registration_number || "")} onChange={(e) => setField("vat_registration_number", e.target.value)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Payment Terms</label>
                  <select value={String(editForm.payment_terms || "")} onChange={(e) => setField("payment_terms", e.target.value)} className={`mt-1 ${inputClass}`}>
                    <option value="">Select</option>
                    <option value="COD">COD</option>
                    <option value="Advance">Advance</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Net 90">Net 90</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Credit Limit</label>
                  <input type="number" min="0" step="0.01" value={Number(editForm.credit_limit || 0)} onChange={(e) => setField("credit_limit", parseFloat(e.target.value) || 0)} className={`mt-1 ${inputClass}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Status</label>
                  <select value={String(editForm.status)} onChange={(e) => setField("status", e.target.value)} className={`mt-1 ${inputClass}`}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
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
                onClick={handleUpdate}
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
