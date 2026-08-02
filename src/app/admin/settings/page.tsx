"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("business");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const businessFields = [
    { key: "business_name", label: "Business Name", icon: "🏪" },
    { key: "address", label: "Address", icon: "📍" },
    { key: "city", label: "City", icon: "🏙️" },
    { key: "state", label: "State", icon: "🗺️" },
  ];

  const contactFields = [
    { key: "phone", label: "Phone Number", icon: "📞" },
    { key: "whatsapp", label: "WhatsApp Number", icon: "💬" },
    { key: "email", label: "Email Address", icon: "✉️" },
    { key: "doctor_name", label: "Doctor Name", icon: "🩺" },
  ];

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: "business", label: "Business", icon: "🏪" },
            { id: "contact", label: "Contact", icon: "📞" },
            { id: "emergency", label: "Emergency", icon: "🚨" },
            { id: "hours", label: "Hours", icon: "🕐" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? "bg-primary-600 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {/* Business Info Tab */}
            {activeTab === "business" && (
              <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🏪</span> Business Information
                </h2>
                <div className="space-y-4">
                  {businessFields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <span>{f.icon}</span> {f.label}
                      </label>
                      <input
                        value={settings[f.key] || ""}
                        onChange={(e) => update(f.key, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>📞</span> Contact Details
                </h2>
                <div className="space-y-4">
                  {contactFields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <span>{f.icon}</span> {f.label}
                      </label>
                      <input
                        value={settings[f.key] || ""}
                        onChange={(e) => update(f.key, e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Tab */}
            {activeTab === "emergency" && (
              <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🚨</span> Emergency Night Service
                </h2>
                
                <div className="bg-amber-50 rounded-xl p-4 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emergency_banner_active === "true"}
                      onChange={(e) => update("emergency_banner_active", e.target.checked ? "true" : "false")}
                      className="w-6 h-6 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 block">
                        Enable Emergency Banner
                      </span>
                      <span className="text-xs text-slate-500">
                        Shows a red banner on the public website
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    🚨 Emergency Contact Number
                  </label>
                  <input
                    value={settings.emergency_contact || ""}
                    onChange={(e) => update("emergency_contact", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="+91 8336027489"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    This number will be displayed in the emergency banner
                  </p>
                </div>
              </div>
            )}

            {/* Hours Tab */}
            {activeTab === "hours" && (
              <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🕐</span> Business Hours
                </h2>
                <p className="text-xs text-slate-500 mb-3 bg-slate-50 p-3 rounded-lg">
                  Edit the JSON below to update business hours. Format:<br/>
                  <code className="text-primary-600">{`{"monday": {"open": "08:00", "close": "22:00"}}`}</code>
                </p>
                <textarea
                  value={settings.business_hours || ""}
                  onChange={(e) => update("business_hours", e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
            )}

            {/* Save Button - Always visible */}
            <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save All Settings"}
              </button>
              {saved && (
                <span className="text-accent-600 text-sm text-center">✓ Settings saved!</span>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
