"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/PublicLayout";

interface Schedule {
  id: number;
  doctorName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AppointmentPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    doctorName: "Dr. Sharma",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => r.json())
      .then(setSchedules)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.customerPhone || !form.appointmentDate || !form.appointmentTime) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const whatsappLink = `https://wa.me/918336027489?text=${encodeURIComponent(
    `Hi, I'd like to book a doctor appointment at Sharma Pharmacy.\n\nName: ${form.customerName}\nPhone: ${form.customerPhone}\nPreferred Date: ${form.appointmentDate}\nPreferred Time: ${form.appointmentTime}\nNotes: ${form.notes}`
  )}`;

  if (submitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-fadeIn">
          <div className="text-5xl sm:text-6xl mb-6">✅</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-3">Appointment Requested!</h1>
          <p className="text-slate-500 mb-6 text-sm sm:text-base">
            We&apos;ve received your request. Our team will confirm shortly via phone or WhatsApp.
          </p>
          <div className="bg-primary-50 rounded-xl p-5 text-left text-sm space-y-2 mb-8">
            <p><strong>Name:</strong> {form.customerName}</p>
            <p><strong>Phone:</strong> {form.customerPhone}</p>
            <p><strong>Date:</strong> {form.appointmentDate}</p>
            <p><strong>Time:</strong> {form.appointmentTime}</p>
            <p><strong>Doctor:</strong> {form.doctorName}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium text-center">
              Back to Home
            </a>
            <a
              href="tel:+918336027489"
              className="border-2 border-primary-200 text-primary-700 px-6 py-3 rounded-xl font-medium text-center"
            >
              📞 Call to Confirm
            </a>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2 sm:mb-3">
            Book Doctor Appointment
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Schedule an in-house consultation at Sharma Pharmacy, Howrah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Schedule Sidebar - Shows on top for mobile */}
          <div className="lg:col-span-2 lg:order-1">
            <div className="bg-primary-50 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-primary-900 mb-4 text-sm sm:text-base">Doctor Availability</h3>
              
              {/* Mobile: Horizontal scroll */}
              <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {dayNames.map((day, i) => {
                  const sched = schedules.find((s) => s.dayOfWeek === i);
                  return (
                    <div
                      key={day}
                      className={`shrink-0 w-20 p-2.5 rounded-lg text-center text-xs ${
                        sched?.isAvailable
                          ? "bg-white text-slate-700 shadow-sm"
                          : "bg-primary-100/50 text-slate-400"
                      }`}
                    >
                      <div className="font-medium">{shortDays[i]}</div>
                      <div className="mt-1">
                        {sched?.isAvailable ? `${sched.startTime}` : "Closed"}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Desktop: Vertical list */}
              <div className="hidden lg:block space-y-2">
                {dayNames.map((day, i) => {
                  const sched = schedules.find((s) => s.dayOfWeek === i);
                  return (
                    <div
                      key={day}
                      className={`flex justify-between items-center p-3 rounded-lg text-sm ${
                        sched?.isAvailable
                          ? "bg-white text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      <span>
                        {sched?.isAvailable
                          ? `${sched.startTime} - ${sched.endTime}`
                          : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* WhatsApp CTA */}
              <div className="mt-4 pt-4 border-t border-primary-100">
                <p className="text-xs sm:text-sm text-primary-700 font-medium mb-2">
                  Prefer WhatsApp?
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-600 active:bg-accent-700 w-full justify-center lg:w-auto"
                >
                  💬 Book via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={form.appointmentDate}
                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={form.appointmentTime}
                    onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes / Symptoms (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none text-base"
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 text-base"
              >
                {loading ? "Submitting..." : "Request Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
