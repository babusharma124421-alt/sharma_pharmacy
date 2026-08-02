"use client";

import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";

export default function DeliveryPage() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    medicineList: "",
    preferredTime: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.customerPhone || !form.deliveryAddress) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-fadeIn">
          <div className="text-5xl sm:text-6xl mb-6">🚚</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-3">Delivery Request Submitted!</h1>
          <p className="text-slate-500 mb-8 text-sm sm:text-base">
            Our team will contact you at {form.customerPhone} to confirm your delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium text-center">
              Back to Home
            </a>
            <a
              href="tel:+918336027489"
              className="border-2 border-primary-200 text-primary-700 px-6 py-3 rounded-xl font-medium text-center"
            >
              📞 Call for Update
            </a>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2 sm:mb-3">
            Home Delivery Request
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Get your medicines delivered to your doorstep by Sharma Pharmacy.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-primary-800">
            <p className="font-medium">Delivery Area</p>
            <p className="text-primary-600">We deliver within Liluah, Howrah and nearby areas. Delivery charges may apply.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Delivery Address *</label>
            <textarea
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none text-base"
              placeholder="Full address with landmark, pin code..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Medicine List
            </label>
            <textarea
              value={form.medicineList}
              onChange={(e) => setForm({ ...form, medicineList: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none text-base"
              placeholder="e.g., Paracetamol 500mg x 10, Cetirizine 10mg x 5"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Or <a href="/prescription" className="text-primary-600 underline">upload a prescription</a> instead
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Delivery Time</label>
            <input
              type="text"
              value={form.preferredTime}
              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
              placeholder="e.g., Before 5 PM today, Tomorrow morning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none text-base"
              placeholder="Any special instructions..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Submitting..." : "🚚 Submit Delivery Request"}
          </button>
        </form>

        {/* WhatsApp Alternative */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-3">
            <span className="h-px w-8 bg-slate-200"></span>
            or
            <span className="h-px w-8 bg-slate-200"></span>
          </div>
          <p className="text-slate-500 text-sm mb-3">
            Order via WhatsApp for faster response
          </p>
          <a
            href="https://wa.me/918336027489?text=Hi%2C%20I%20need%20home%20delivery%20of%20medicines."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-600 active:bg-accent-700 transition-colors"
          >
            💬 Order on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
