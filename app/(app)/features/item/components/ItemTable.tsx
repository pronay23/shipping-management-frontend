"use client";

import { useEffect, useState } from "react";
import type { Item, Uom } from "../types";
import { getItemList } from "../api/getItemList";
import { updateItem } from "../api/updateItem";
import { deleteItem } from "../api/deleteItem";
import { getUomList } from "../api/getUomList";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export default function ItemTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [uoms, setUoms] = useState<Uom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    getUomList().then(setUoms);
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getItemList();
      setItems(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(item: Item) {
    setEditingItem(item);
    setEditForm({
      item_code: item.item_code,
      item_name: item.item_name,
      item_type: item.item_type || "",
      uom_id: item.uom_id ?? null,
      item_prices: item.item_prices ?? 0,
      item_taxes: item.item_taxes ?? 0,
    });
    setSaveError(null);
    setEditModalOpen(true);
  }

  function setField(key: string, value: unknown) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpdate() {
    if (!editingItem) return;
    if (!String(editForm.item_code || "").trim() || !String(editForm.item_name || "").trim()) {
      setSaveError("Item code and name are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateItem(editingItem.id, {
        item_code: String(editForm.item_code).trim(),
        item_name: String(editForm.item_name).trim(),
        item_type: String(editForm.item_type || "").trim() || null,
        uom_id: editForm.uom_id ? Number(editForm.uom_id) : null,
        item_prices: Number(editForm.item_prices) || 0,
        item_taxes: Number(editForm.item_taxes) || 0,
      });
      setSuccessMsg("Item updated successfully!");
      await fetchData();
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Item) {
    if (!confirm(`Are you sure you want to delete "${item.item_name}"?`)) return;
    try {
      await deleteItem(item.id);
      setSuccessMsg("Item deleted successfully!");
      await fetchData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">Loading items...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        No items found.{" "}
        <a href="/features/item/create" className="font-medium text-sky-600 hover:underline">
          Add an item
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
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">UOM</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Tax</th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-500">
                  {item.item_code}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px] truncate">
                  {item.item_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {item.item_type || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {item.uom?.uom_name || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-slate-600">
                  {item.item_prices.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-slate-600">
                  {item.item_taxes.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition"
                      title="Edit Item"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Item"
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
      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Item</h2>
                <p className="text-sm text-slate-500">{editingItem.item_code} - {editingItem.item_name}</p>
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

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Item Code <span className="text-rose-500">*</span>
                </label>
                <input type="text" value={String(editForm.item_code || "")} onChange={(e) => setField("item_code", e.target.value)} className={`mt-1 ${inputClass}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input type="text" value={String(editForm.item_name || "")} onChange={(e) => setField("item_name", e.target.value)} className={`mt-1 ${inputClass}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Item Type</label>
                <select value={String(editForm.item_type || "")} onChange={(e) => setField("item_type", e.target.value)} className={`mt-1 ${inputClass}`}>
                  <option value="">Select type</option>
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                  <option value="Consumable">Consumable</option>
                  <option value="Fixed Asset">Fixed Asset</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">UOM</label>
                <select value={editForm.uom_id ?? ""} onChange={(e) => setField("uom_id", e.target.value ? Number(e.target.value) : null)} className={`mt-1 ${inputClass}`}>
                  <option value="">Select UOM</option>
                  {uoms.map((uom) => (<option key={uom.id} value={uom.id}>{uom.uom_name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Price (BDT)</label>
                <input type="number" min="0" step="0.01" value={Number(editForm.item_prices || 0)} onChange={(e) => setField("item_prices", parseFloat(e.target.value) || 0)} className={`mt-1 ${inputClass}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Tax (BDT)</label>
                <input type="number" min="0" step="0.01" value={Number(editForm.item_taxes || 0)} onChange={(e) => setField("item_taxes", parseFloat(e.target.value) || 0)} className={`mt-1 ${inputClass}`} />
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
