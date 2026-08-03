"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { fetchJson } from "@/lib/fetch-json";

interface Medicine {
  id: number;
  name: string;
  genericName: string | null;
  manufacturer: string | null;
  category: string | null;
  batchNumber: string | null;
  quantity: number;
  reorderLevel: number;
  unitPrice: string;
  mrp: string;
  gstPercent: string;
  expiryDate: string | null;
  requiresPrescription: boolean;
  active: boolean;
}

const emptyForm = {
  name: "", genericName: "", manufacturer: "", category: "",
  batchNumber: "", quantity: 0, reorderLevel: 10, unitPrice: "0",
  mrp: "0", gstPercent: "12", expiryDate: "", requiresPrescription: false,
};

export default function InventoryPage() {
  const [meds, setMeds] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => {
    fetch("/api/medicines?all=true")
      .then((r) => r.json())
      .then((data) => {
        setMeds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const url = editId ? `/api/medicines/${editId}` : "/api/medicines";
    const method = editId ? "PUT" : "POST";
    setError("");
    setNotice("");
    try {
      await fetchJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      setNotice(editId ? "Medicine updated successfully." : "Medicine added successfully.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save medicine.");
    }
  };

  const handleEdit = (med: Medicine) => {
    setForm({
      name: med.name,
      genericName: med.genericName || "",
      manufacturer: med.manufacturer || "",
      category: med.category || "",
      batchNumber: med.batchNumber || "",
      quantity: med.quantity,
      reorderLevel: med.reorderLevel,
      unitPrice: med.unitPrice,
      mrp: med.mrp,
      gstPercent: med.gstPercent,
      expiryDate: med.expiryDate || "",
      requiresPrescription: med.requiresPrescription,
    });
    setEditId(med.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this medicine?")) return;
    setError("");
    setNotice("");
    try {
      await fetchJson(`/api/medicines/${id}`, { method: "DELETE" });
      setNotice("Medicine removed from inventory.");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete medicine.");
    }
  };

  const filtered = meds.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.genericName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Inventory</h1>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 active:bg-primary-800 w-full sm:w-auto"
          >
            + Add Medicine
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        />

        {notice && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            ✓ {notice}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  {editId ? "Edit Medicine" : "Add Medicine"}
                </h2>
                <button 
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <input 
                  placeholder="Medicine Name *" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                />
                <input 
                  placeholder="Generic Name" 
                  value={form.genericName} 
                  onChange={(e) => setForm({ ...form, genericName: e.target.value })} 
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Manufacturer" 
                    value={form.manufacturer} 
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                  />
                  <input 
                    placeholder="Category" 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                  />
                </div>
                <input 
                  placeholder="Batch Number" 
                  value={form.batchNumber} 
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} 
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Quantity</label>
                    <input 
                      type="number" 
                      value={form.quantity} 
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Unit Price</label>
                    <input 
                      value={form.unitPrice} 
                      onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">MRP</label>
                    <input 
                      value={form.mrp} 
                      onChange={(e) => setForm({ ...form, mrp: e.target.value })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">GST %</label>
                    <input 
                      value={form.gstPercent} 
                      onChange={(e) => setForm({ ...form, gstPercent: e.target.value })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Reorder Lvl</label>
                    <input 
                      type="number" 
                      value={form.reorderLevel} 
                      onChange={(e) => setForm({ ...form, reorderLevel: parseInt(e.target.value) || 10 })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Expiry</label>
                    <input 
                      type="date" 
                      value={form.expiryDate} 
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} 
                      className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input 
                    type="checkbox" 
                    checked={form.requiresPrescription} 
                    onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })} 
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-slate-700">Requires Prescription (Rx)</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleSave} 
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-primary-700 active:bg-primary-800"
                >
                  {editId ? "Update" : "Add"} Medicine
                </button>
                <button 
                  onClick={() => { setShowForm(false); setEditId(null); }} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-slate-400">
            {search ? "No medicines match your search" : "No medicines in inventory"}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((med) => (
              <div 
                key={med.id} 
                className="bg-white rounded-xl border border-slate-100 p-4 active:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {med.name}
                      </h3>
                      {med.requiresPrescription && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0">
                          Rx
                        </span>
                      )}
                    </div>
                    {med.genericName && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{med.genericName}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                      {med.category && (
                        <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                          {med.category}
                        </span>
                      )}
                      {med.manufacturer && <span>{med.manufacturer}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-primary-700">₹{med.mrp}</div>
                    <div className={`text-sm font-medium mt-1 ${
                      med.quantity <= med.reorderLevel ? "text-amber-600" : "text-accent-600"
                    }`}>
                      {med.quantity} {med.quantity <= med.reorderLevel && "⚠️"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(med)} 
                    className="flex-1 text-primary-600 bg-primary-50 hover:bg-primary-100 active:bg-primary-200 py-2 rounded-lg text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(med.id)} 
                    className="flex-1 text-red-500 bg-red-50 hover:bg-red-100 active:bg-red-200 py-2 rounded-lg text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
