"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import Link from "next/link";

interface Stats {
  totalMedicines: number;
  lowStock: number;
  todayAppointments: number;
  pendingPrescriptions: number;
  pendingDeliveries: number;
  totalInvoices: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalMedicines: 0,
    lowStock: 0,
    todayAppointments: 0,
    pendingPrescriptions: 0,
    pendingDeliveries: 0,
    totalInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed database on first visit
    fetch("/api/seed", { method: "POST" }).catch(() => {});

    Promise.all([
      fetch("/api/medicines?all=true").then((r) => r.json()),
      fetch("/api/appointments").then((r) => r.json()),
      fetch("/api/prescriptions").then((r) => r.json()),
      fetch("/api/delivery").then((r) => r.json()),
      fetch("/api/invoices").then((r) => r.json()),
    ])
      .then(([meds, appts, rxs, dels, invs]) => {
        const medsArr = Array.isArray(meds) ? meds : [];
        const apptsArr = Array.isArray(appts) ? appts : [];
        const rxsArr = Array.isArray(rxs) ? rxs : [];
        const delsArr = Array.isArray(dels) ? dels : [];
        const invsArr = Array.isArray(invs) ? invs : [];

        const today = new Date().toISOString().split("T")[0];
        setStats({
          totalMedicines: medsArr.length,
          lowStock: medsArr.filter(
            (m: { quantity: number; reorderLevel: number }) => m.quantity <= m.reorderLevel
          ).length,
          todayAppointments: apptsArr.filter(
            (a: { appointmentDate: string }) => a.appointmentDate === today
          ).length,
          pendingPrescriptions: rxsArr.filter(
            (r: { status: string }) => r.status === "pending"
          ).length,
          pendingDeliveries: delsArr.filter(
            (d: { status: string }) => d.status === "pending"
          ).length,
          totalInvoices: invsArr.length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Medicines", value: stats.totalMedicines, icon: "💊", color: "bg-primary-50 text-primary-700", href: "/admin/inventory" },
    { label: "Low Stock", value: stats.lowStock, icon: "⚠️", color: stats.lowStock > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600", href: "/admin/inventory" },
    { label: "Today Appts", value: stats.todayAppointments, icon: "🩺", color: "bg-accent-50 text-accent-700", href: "/admin/appointments" },
    { label: "Pending Rx", value: stats.pendingPrescriptions, icon: "📋", color: "bg-blue-50 text-blue-700", href: "/admin/prescriptions" },
    { label: "Deliveries", value: stats.pendingDeliveries, icon: "🚚", color: "bg-purple-50 text-purple-700", href: "/admin/delivery" },
    { label: "Invoices", value: stats.totalInvoices, icon: "🧾", color: "bg-slate-50 text-slate-700", href: "/admin/invoices" },
  ];

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Grid - 2 columns on mobile, 3 on tablet+ */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {cards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className={`${card.color} rounded-xl p-4 sm:p-5 border border-slate-100 active:scale-[0.98] transition-transform`}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xl sm:text-2xl">{card.icon}</span>
                    <span className="text-2xl sm:text-3xl font-bold">{card.value}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium opacity-80">{card.label}</p>
                </Link>
              ))}
            </div>

            {/* Low Stock Alert */}
            {stats.lowStock > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
                <h3 className="font-semibold text-amber-800 mb-1 text-sm sm:text-base">⚠️ Low Stock Alert</h3>
                <p className="text-xs sm:text-sm text-amber-600">
                  {stats.lowStock} medicine(s) need restocking.{" "}
                  <Link href="/admin/inventory" className="underline font-medium">
                    View Inventory →
                  </Link>
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm sm:text-base">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { href: "/admin/inventory", label: "Add Medicine", icon: "➕" },
                  { href: "/admin/invoices", label: "New Invoice", icon: "🧾" },
                  { href: "/admin/prescriptions", label: "Review Rx", icon: "📋" },
                  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
                ].map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="bg-slate-50 hover:bg-primary-50 active:bg-primary-100 rounded-xl p-4 text-center transition-colors"
                  >
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-xs font-medium text-slate-600">{a.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
