"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

interface Prescription {
  id: number;
  customerName: string;
  customerPhone: string;
  fileName: string;
  fileType: string;
  fileData: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-blue-100 text-blue-700",
  fulfilled: "bg-accent-100 text-accent-700",
};

export default function PrescriptionsAdmin() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const load = () => {
    fetch("/api/prescriptions")
      .then((r) => r.json())
      .then((d) => { setPrescriptions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/prescriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const viewing = prescriptions.find((p) => p.id === viewingId);
  const filtered = filter === "all" 
    ? prescriptions 
    : prescriptions.filter(p => p.status === filter);

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Prescriptions</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {["all", "pending", "reviewed", "fulfilled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-primary-600 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* View modal */}
        {viewing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-start p-4 border-b">
                <div>
                  <h2 className="font-bold text-slate-800">{viewing.customerName}</h2>
                  <a href={`tel:${viewing.customerPhone}`} className="text-sm text-primary-600">
                    📞 {viewing.customerPhone}
                  </a>
                </div>
                <button 
                  onClick={() => setViewingId(null)} 
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {viewing.fileType.startsWith("image/") ? (
                  <img src={viewing.fileData} alt="Prescription" className="w-full rounded-lg" />
                ) : (
                  <div className="bg-slate-50 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-slate-500 text-sm">{viewing.fileName}</p>
                    <a 
                      href={viewing.fileData} 
                      download={viewing.fileName} 
                      className="inline-block mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Download PDF
                    </a>
                  </div>
                )}
                {viewing.notes && (
                  <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <strong>Notes:</strong> {viewing.notes}
                  </p>
                )}
              </div>
              <div className="p-4 border-t flex gap-2">
                {viewing.status === "pending" && (
                  <button 
                    onClick={() => { updateStatus(viewing.id, "reviewed"); setViewingId(null); }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium"
                  >
                    Mark Reviewed
                  </button>
                )}
                {viewing.status === "reviewed" && (
                  <button 
                    onClick={() => { updateStatus(viewing.id, "fulfilled"); setViewingId(null); }}
                    className="flex-1 bg-accent-600 text-white py-3 rounded-xl text-sm font-medium"
                  >
                    Mark Fulfilled
                  </button>
                )}
                <button 
                  onClick={() => setViewingId(null)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-slate-400">
            No {filter === "all" ? "" : filter} prescriptions
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rx) => (
              <div key={rx.id} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm">{rx.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[rx.status]}`}>
                        {rx.status}
                      </span>
                    </div>
                    <a href={`tel:${rx.customerPhone}`} className="text-xs text-primary-600 mt-1 block">
                      📞 {rx.customerPhone}
                    </a>
                    <p className="text-xs text-slate-400 mt-1">
                      📄 {rx.fileName} · {new Date(rx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => setViewingId(rx.id)}
                    className="bg-primary-50 text-primary-600 px-4 py-2 rounded-lg text-xs font-medium shrink-0"
                  >
                    View
                  </button>
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                  {rx.status === "pending" && (
                    <button 
                      onClick={() => updateStatus(rx.id, "reviewed")}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-medium"
                    >
                      ✓ Reviewed
                    </button>
                  )}
                  {rx.status === "reviewed" && (
                    <button 
                      onClick={() => updateStatus(rx.id, "fulfilled")}
                      className="flex-1 bg-accent-50 text-accent-700 py-2 rounded-lg text-xs font-medium"
                    >
                      ✓ Fulfilled
                    </button>
                  )}
                  <a 
                    href={`tel:${rx.customerPhone}`}
                    className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-xs font-medium"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
