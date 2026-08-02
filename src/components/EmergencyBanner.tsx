"use client";

import { useEffect, useState } from "react";

export default function EmergencyBanner() {
  const [active, setActive] = useState(false);
  const [phone, setPhone] = useState("+91 8336027489");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setActive(s.emergency_banner_active === "true");
        if (s.emergency_contact) setPhone(s.emergency_contact);
      })
      .catch(() => {});
  }, []);

  if (!active) return null;

  return (
    <div className="bg-red-600 text-white px-3 py-2.5 sm:py-3 animate-pulse-soft">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚨</span>
          <span className="text-sm sm:text-base font-medium">Emergency Service Active</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href={`tel:${phone.replace(/\s/g, "")}`} 
            className="bg-white text-red-600 px-4 py-1.5 sm:py-2 rounded-full text-sm font-bold hover:bg-red-50 active:bg-red-100 transition-colors flex items-center gap-1.5"
          >
            <span>📞</span> {phone}
          </a>
          <a
            href="https://www.google.com/maps/place/Sharma+Pharmacy/@22.6200282,88.3271886"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-700 text-white px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-red-800 active:bg-red-900 transition-colors"
          >
            📍 Directions
          </a>
        </div>
      </div>
    </div>
  );
}
