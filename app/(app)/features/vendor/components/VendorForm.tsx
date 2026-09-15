"use client";

import { useEffect, useState } from "react";
import type { VendorCategory, Country, Currency } from "../types";
import { getVendorCategories } from "../api/getVendorCategories";
import { getCountries } from "../api/getCountries";
import { getCurrencies } from "../api/getCurrencies";

interface VendorFormProps {
  initialData?: {
    vendor_code?: string;
    vendor_name?: string;
    vendor_type?: string;
    vendor_category_id?: number | null;
    country_id?: number | null;
    currency_id?: number | null;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    tin_number?: string;
    vat_registration_number?: string;
    payment_terms?: string;
    credit_limit?: number;
    status?: string;
  };
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function VendorForm({
  initialData = {},
  onSubmit,
  submitLabel,
  submittingLabel = "Saving...",
}: VendorFormProps) {
  const [vendorCode, setVendorCode] = useState(initialData.vendor_code || "");
  const [vendorName, setVendorName] = useState(initialData.vendor_name || "");
  const [vendorType, setVendorType] = useState(initialData.vendor_type || "");
  const [vendorCategoryId, setVendorCategoryId] = useState<number | null>(initialData.vendor_category_id ?? null);
  const [countryId, setCountryId] = useState<number | null>(initialData.country_id ?? null);
  const [currencyId, setCurrencyId] = useState<number | null>(initialData.currency_id ?? null);
  const [contactPerson, setContactPerson] = useState(initialData.contact_person || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [tinNumber, setTinNumber] = useState(initialData.tin_number || "");
  const [vatRegistrationNumber, setVatRegistrationNumber] = useState(initialData.vat_registration_number || "");
  const [paymentTerms, setPaymentTerms] = useState(initialData.payment_terms || "");
  const [creditLimit, setCreditLimit] = useState(initialData.credit_limit ?? 0);
  const [status, setStatus] = useState(initialData.status || "active");

  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getVendorCategories(), getCountries(), getCurrencies()]).then(
      ([cats, cos, cur]) => {
        setCategories(cats);
        setCountries(cos);
        setCurrencies(cur);
      }
    );
  }, []);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!vendorCode.trim()) nextErrors.vendor_code = "Vendor code is required.";
    if (!vendorName.trim()) nextErrors.vendor_name = "Vendor name is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        vendor_code: vendorCode.trim(),
        vendor_name: vendorName.trim(),
        vendor_type: vendorType.trim() || null,
        vendor_category_id: vendorCategoryId,
        country_id: countryId,
        currency_id: currencyId,
        contact_person: contactPerson.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        tin_number: tinNumber.trim() || null,
        vat_registration_number: vatRegistrationNumber.trim() || null,
        payment_terms: paymentTerms.trim() || null,
        credit_limit: creditLimit,
        status,
      });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
          {formError}
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Basic Information</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Vendor Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. VND-0001"
              value={vendorCode}
              onChange={(e) => setVendorCode(e.target.value)}
              className={`mt-1 ${inputClass} ${errors.vendor_code ? "border-rose-300" : ""}`}
            />
            {errors.vendor_code && <p className="mt-1 text-xs text-rose-600">{errors.vendor_code}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Vendor Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ABC Company Ltd"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className={`mt-1 ${inputClass} ${errors.vendor_name ? "border-rose-300" : ""}`}
            />
            {errors.vendor_name && <p className="mt-1 text-xs text-rose-600">{errors.vendor_name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Vendor Type
            </label>
            <select
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Select type</option>
              <option value="Supplier">Local</option>
              <option value="Service Provider">Foreign</option> 
            </select>
          </div>
        </div>
      </div>

      {/* Dropdowns */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Classification</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Vendor Category
            </label>
            <select
              value={vendorCategoryId ?? ""}
              onChange={(e) => setVendorCategoryId(e.target.value ? Number(e.target.value) : null)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Country
            </label>
            <select
              value={countryId ?? ""}
              onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : null)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Currency
            </label>
            <select
              value={currencyId ?? ""}
              onChange={(e) => setCurrencyId(e.target.value ? Number(e.target.value) : null)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Select currency</option>
              {currencies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.currency_name} ({c.currency_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Contact Information</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Contact Person
            </label>
            <input
              type="text"
              placeholder="Contact person name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Phone
            </label>
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Address
          </label>
          <textarea
            rows={2}
            placeholder="Full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`mt-1 ${inputClass} resize-y`}
          />
        </div>
      </div>

      {/* Legal & Financial */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Legal & Financial</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              TIN Number
            </label>
            <input
              type="text"
              placeholder="Tax Identification Number"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              VAT Registration Number
            </label>
            <input
              type="text"
              placeholder="VAT Registration Number"
              value={vatRegistrationNumber}
              onChange={(e) => setVatRegistrationNumber(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="">Select payment terms</option>
              <option value="COD">COD</option>
              <option value="Advance">Advance</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Net 90">Net 90</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Credit Limit
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={creditLimit}
              onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`mt-1 ${inputClass}`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
