"use client";

import { useState, useRef } from "react";
import PublicLayout from "@/components/PublicLayout";

export default function PrescriptionPage() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(f.type)) {
      setError("Please upload a PDF or JPG/PNG image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }
    setFile(f);
    setError("");
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.customerName || !form.customerPhone || !file) {
      setError("Please fill all required fields and upload a file.");
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/prescriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: form.customerName,
            customerPhone: form.customerPhone,
            fileName: file.name,
            fileData: base64,
            fileType: file.type,
            notes: form.notes,
          }),
        });
        if (res.ok) {
          setSubmitted(true);
        } else {
          const data = await res.json();
          setError(data.error || "Upload failed.");
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-fadeIn">
          <div className="text-5xl sm:text-6xl mb-6">📋</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-3">Prescription Uploaded!</h1>
          <p className="text-slate-500 mb-8 text-sm sm:text-base">
            Our pharmacist will review your prescription and contact you at {form.customerPhone}.
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
            Upload Prescription
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Upload your doctor&apos;s prescription as PDF or image. We&apos;ll prepare your medicines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
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

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Prescription File *
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 active:bg-primary-50 transition-colors"
            >
              {file ? (
                <div>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-32 sm:max-h-40 mx-auto mb-3 rounded-lg"
                    />
                  )}
                  {!preview && file.type === "application/pdf" && (
                    <div className="text-4xl mb-3">📄</div>
                  )}
                  <p className="text-sm text-slate-700 font-medium truncate px-4">{file.name}</p>
                  <p className="text-xs text-primary-600 mt-2">Tap to change file</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl mb-3">📎</div>
                  <p className="text-slate-600 font-medium text-sm sm:text-base">Tap to upload prescription</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none text-base"
              placeholder="Any specific instructions..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Uploading..." : "📋 Upload Prescription"}
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
            Send your prescription directly on WhatsApp
          </p>
          <a
            href="https://wa.me/918336027489?text=Hi%2C%20I%20want%20to%20send%20my%20prescription."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-600 active:bg-accent-700 transition-colors"
          >
            💬 Send on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
