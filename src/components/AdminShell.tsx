"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/inventory", label: "Inventory", icon: "💊" },
  { href: "/admin/appointments", label: "Appointments", icon: "🩺" },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: "📋" },
  { href: "/admin/invoices", label: "Invoices", icon: "🧾" },
  { href: "/admin/delivery", label: "Delivery", icon: "🚚" },
  { href: "/admin/schedule", label: "Schedule", icon: "📅" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/admin";
      return;
    }
    const user = localStorage.getItem("admin_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.fullName || "Admin");
      } catch {
        // ignore malformed stored profile state
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin";
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef7ff_0%,_#f8fafc_45%,_#f1f5f9_100%)]">
      <header className="lg:hidden bg-primary-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-primary-950/20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-lg hover:bg-primary-800 active:bg-primary-700"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary-700 font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-sm">Sharma Pharmacy</span>
        </div>
        <Link href="/" className="p-2 -mr-2 rounded-lg hover:bg-primary-800 text-xs">
          🌐
        </Link>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-primary-950 text-white transform transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="hidden lg:block p-5 border-b border-primary-800/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-700 font-bold">S</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Sharma Pharmacy</div>
                <div className="text-xs text-primary-300">Control Center</div>
              </div>
            </div>
          </div>

          <div className="lg:hidden h-14"></div>

          <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 188px)" }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                  pathname === item.href
                    ? "bg-primary-700 text-white font-medium shadow-lg shadow-primary-900/30"
                    : "text-primary-100 hover:bg-primary-800/90 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-800/70 bg-primary-950">
            <div className="rounded-xl bg-primary-900/70 px-3 py-3 mb-3">
              <div className="text-[11px] text-primary-300 uppercase tracking-[0.24em]">Signed in as</div>
              <div className="mt-1 text-sm font-semibold text-white truncate">{userName}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-primary-100 hover:text-white bg-primary-800 hover:bg-primary-700 active:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors text-left flex items-center gap-2"
            >
              <span>←</span> Sign Out
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 min-w-0 lg:min-h-screen">
          <header className="hidden lg:flex bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-3 items-center gap-4 sticky top-0 z-20">
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.28em] text-primary-600 font-semibold">Operations</div>
              <h2 className="text-sm font-semibold text-slate-800">Sharma Pharmacy — Admin</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-[11px] font-semibold">Live</span>
              <Link href="/" target="_blank" className="text-xs text-primary-600 hover:underline">
                View Public Site →
              </Link>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 z-40">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 rounded-lg ${
                pathname === item.href
                  ? "text-primary-600 bg-primary-50"
                  : "text-slate-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label.slice(0, 6)}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="lg:hidden h-16"></div>
    </div>
  );
}
