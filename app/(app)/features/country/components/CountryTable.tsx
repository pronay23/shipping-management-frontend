"use client";

import { useEffect, useState } from "react";
import type { Country } from "../types";
import { getCountryList } from "../api/getCountryList";
import { updateCountry } from "../api/updateCountry";
import { deleteCountry } from "../api/deleteCountry";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function CountryTable() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editCountryCode, setEditCountryCode] = useState("");
  const [editCountryName, setEditCountryName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  async function fetchCountries() {
    setLoading(true);
    try {
      const data = await getCountryList();
      setCountries(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load countries");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(country: Country) {
    setEditingCountry(country);
    setEditCountryCode(country.country_code);
    setEditCountryName(country.country_name);
    setSaveError(null);
    setEditModalOpen(true);
  }

  async function handleUpdate() {
    if (!editingCountry) return;
    if (!editCountryCode.trim() || !editCountryName.trim()) {
      setSaveError("Both fields are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateCountry(editingCountry.id, {
        country_code: editCountryCode.trim().toUpperCase(),
        country_name: editCountryName.trim(),
      });
      setSuccessMsg("Country updated successfully!");
      await fetchCountries();
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update country");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(country: Country) {
    if (!confirm(`Are you sure you want to delete "${country.country_name}"?`)) return;
    try {
      await deleteCountry(country.id);
      setSuccessMsg("Country deleted successfully!");
      await fetchCountries();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete country");
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">Loading countries...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
        {error}
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No countries found.{" "}
        <a href="/features/country/create" className="font-medium text-sky-600 hover:underline">
          Add a country
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
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Country Code</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Country Name</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {countries.map((country) => (
              <tr key={country.id} className="hover:bg-slate-50 transition">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                  {country.id}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-slate-900">
                  {country.country_code}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">{country.country_name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(country)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                      title="Edit Country"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(country)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Country"
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

      {editModalOpen && editingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Country</h2>
                <p className="text-sm text-slate-500">ID: {editingCountry.id}</p>
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Country Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCountryCode}
                  onChange={(e) => setEditCountryCode(e.target.value)}
                  maxLength={10}
                  className={`mt-1 ${inputClass}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Country Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editCountryName}
                  onChange={(e) => setEditCountryName(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                />
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
