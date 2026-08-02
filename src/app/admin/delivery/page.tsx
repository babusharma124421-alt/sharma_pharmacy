"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

interface DeliveryRequest {
  id: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  medicineList: string | null;
  preferredTime: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  in_transit: "bg-purple-100 text-purple-700",
  delivered: "bg-accent-100 text-accent-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function DeliveryAdmin() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    fetch("/api/delivery")
      .then((r) => r.json())
      .then((d) => { setRequests(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" 
    ? requests 
    : requests.filter(r => r.status === filter);

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Delivery Requests</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {["all", "pending", "assigned", "in_transit", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-primary-600 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.replace("_", " ").charAt(0).toUpperCase() + f.replace("_", " ").slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-slate-400">
            No {filter === "all" ? "" : filter.replace("_", " ")} delivery requests
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm">{req.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[req.status]}`}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <a href={`tel:${req.customerPhone}`} className="text-xs text-primary-600 mt-1 block">
                      📞 {req.customerPhone}
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-2">
                  <div>
                    <p className="text-slate-500 text-xs">📍 Delivery Address</p>
                    <p className="text-slate-700 text-sm">{req.deliveryAddress}</p>
                  </div>
                  {req.medicineList && (
                    <div>
                      <p className="text-slate-500 text-xs">💊 Medicines</p>
                      <p className="text-slate-700 text-sm">{req.medicineList}</p>
                    </div>
                  )}
                  {req.preferredTime && (
                    <div>
                      <p className="text-slate-500 text-xs">⏰ Preferred Time</p>
                      <p className="text-slate-700 text-sm">{req.preferredTime}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <a 
                    href={`tel:${req.customerPhone}`}
                    className="flex-1 bg-primary-50 text-primary-600 py-2.5 rounded-lg text-xs font-medium text-center"
                  >
                    📞 Call Customer
                  </a>
                  <a 
                    href={`https://wa.me/${req.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${req.customerName}, regarding your delivery request from Sharma Pharmacy...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent-50 text-accent-700 py-2.5 rounded-lg text-xs font-medium text-center"
                  >
                    💬 WhatsApp
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
