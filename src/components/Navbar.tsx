"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/search", label: "Medicines", icon: "🔍" },
  { href: "/appointment", label: "Appointment", icon: "🩺" },
  { href: "/prescription", label: "Prescription", icon: "📋" },
  { href: "/delivery", label: "Delivery", icon: "🚚" },
  { href: "/contact", label: "Contact", icon: "📍" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">S</span>
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-primary-900 text-sm sm:text-base">Sharma</span>
                <span className="text-primary-600 text-sm sm:text-base ml-1">Pharmacy</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-primary-600 bg-primary-50 font-medium"
                      : "text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/918336027489?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20medicines%20at%20Sharma%20Pharmacy."
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 active:bg-accent-700 transition-colors flex items-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="tel:+918336027489"
                className="p-2.5 rounded-lg bg-primary-50 text-primary-600 active:bg-primary-100"
                aria-label="Call us"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <button
                onClick={() => setOpen(!open)}
                className="p-2.5 rounded-lg hover:bg-slate-100 active:bg-slate-200"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-fadeIn">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-slate-800">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-colors ${
                    pathname === link.href
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t mt-2 space-y-3">
              <a
                href="https://wa.me/918336027489?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20medicines."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-accent-500 text-white px-4 py-3.5 rounded-xl text-sm font-medium active:bg-accent-600"
              >
                <span>💬</span> WhatsApp Us
              </a>
              <a
                href="tel:+918336027489"
                className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white px-4 py-3.5 rounded-xl text-sm font-medium active:bg-primary-700"
              >
                <span>📞</span> Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
