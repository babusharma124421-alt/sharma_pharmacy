"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

interface Schedule {
  doctorName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleAdmin() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctorName, setDoctorName] = useState("Dr. Sharma");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDoctorName(data[0].doctorName);
          const full: Schedule[] = dayNames.map((_, i) => {
            const existing = data.find((s: Schedule) => s.dayOfWeek === i);
            return existing || { doctorName: data[0].doctorName, dayOfWeek: i, startTime: "10:00", endTime: "14:00", isAvailable: false };
          });
          setSchedules(full);
        } else {
          setSchedules(dayNames.map((_, i) => ({
            doctorName: "Dr. Sharma", dayOfWeek: i, startTime: "10:00", endTime: "14:00", isAvailable: i >= 1 && i <= 6,
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateDay = (index: number, field: keyof Schedule, value: string | boolean) => {
    const updated = [...schedules];
    const item = { ...updated[index] };
    if (field === "isAvailable") {
      item.isAvailable = value as boolean;
    } else if (field === "startTime" || field === "endTime" || field === "doctorName") {
      item[field] = value as string;
    }
    updated[index] = item;
    setSchedules(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = schedules.map((s) => ({ ...s, doctorName }));
    await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminShell>
      <div className="animate-fadeIn">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Doctor Schedule</h1>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Doctor Name</label>
              <input
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <h3 className="font-semibold text-sm text-slate-700 mb-3">Weekly Schedule</h3>
            <div className="space-y-3">
              {schedules.map((sched, i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 transition-colors ${
                    sched.isAvailable ? "bg-accent-50" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sched.isAvailable}
                        onChange={(e) => updateDay(i, "isAvailable", e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="font-medium text-slate-700">
                        <span className="hidden sm:inline">{dayNames[i]}</span>
                        <span className="sm:hidden">{shortDayNames[i]}</span>
                      </span>
                    </label>
                    {!sched.isAvailable && (
                      <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded-full">Closed</span>
                    )}
                  </div>
                  
                  {sched.isAvailable && (
                    <div className="flex items-center gap-2 ml-8">
                      <input
                        type="time"
                        value={sched.startTime}
                        onChange={(e) => updateDay(i, "startTime", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                      <span className="text-slate-400 text-sm">to</span>
                      <input
                        type="time"
                        value={sched.endTime}
                        onChange={(e) => updateDay(i, "endTime", e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save Schedule"}
              </button>
              {saved && (
                <span className="text-accent-600 text-sm text-center sm:text-left">
                  ✓ Schedule saved!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
