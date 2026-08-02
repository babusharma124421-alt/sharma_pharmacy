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
      } catch { /* ignore */ }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin";
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-primary-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
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
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-900 text-white transform transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Desktop Header */}
          <div className="hidden lg:block p-5 border-b border-primary-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-700 font-bold">S</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Sharma Pharmacy</div>
                <div className="text-xs text-primary-300">Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Mobile Close Area */}
          <div className="lg:hidden h-14"></div>

          <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.98] ${
                  pathname === item.href
                    ? "bg-primary-700 text-white font-medium"
                    : "text-primary-200 hover:bg-primary-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700 bg-primary-900">
            <div className="text-xs text-primary-300 mb-2 truncate">👤 {userName}</div>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-primary-200 hover:text-white bg-primary-800 hover:bg-primary-700 active:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors text-left flex items-center gap-2"
            >
              <span>←</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 lg:min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:flex bg-white border-b border-slate-100 px-6 py-3 items-center gap-4 sticky top-0 z-20">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-800">Sharma Pharmacy — Admin</h2>
            </div>
            <Link href="/" target="_blank" className="text-xs text-primary-600 hover:underline">
              View Public Site →
            </Link>
          </header>
          
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 z-40">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg min-w-[60px] ${
                pathname === item.href
                  ? "text-primary-600"
                  : "text-slate-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label.slice(0, 6)}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
}
