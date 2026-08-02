"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-accent-100 text-accent-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AppointmentsAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => { setAppointments(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const filtered = filter === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Appointments</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
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

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-slate-400">
            No {filter === "all" ? "" : filter} appointments
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{apt.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[apt.status] || "bg-slate-100"}`}>
                        {apt.status}
                      </span>
                    </div>
                    <a href={`tel:${apt.customerPhone}`} className="text-sm text-primary-600 mt-1 block">
                      📞 {apt.customerPhone}
                    </a>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium">{apt.appointmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium">{apt.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor</span>
                    <span className="font-medium">{apt.doctorName}</span>
                  </div>
                  {apt.notes && (
                    <div className="pt-2 border-t border-slate-200 mt-2">
                      <span className="text-slate-500 text-xs">Notes: {apt.notes}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  {apt.status === "pending" && (
                    <>
                      <button 
                        onClick={() => updateStatus(apt.id, "confirmed")} 
                        className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-lg text-xs font-medium hover:bg-blue-100 active:bg-blue-200"
                      >
                        ✓ Confirm
                      </button>
                      <button 
                        onClick={() => updateStatus(apt.id, "cancelled")} 
                        className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-lg text-xs font-medium hover:bg-red-100 active:bg-red-200"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <button 
                      onClick={() => updateStatus(apt.id, "completed")} 
                      className="flex-1 bg-accent-50 text-accent-700 py-2.5 rounded-lg text-xs font-medium hover:bg-accent-100 active:bg-accent-200"
                    >
                      ✓ Mark Completed
                    </button>
                  )}
                  <a 
                    href={`tel:${apt.customerPhone}`}
                    className="bg-slate-50 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-100 active:bg-slate-200"
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
