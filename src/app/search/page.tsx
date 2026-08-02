"use client";

import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";

interface Medicine {
  id: number;
  name: string;
  genericName: string | null;
  manufacturer: string | null;
  category: string | null;
  quantity: number;
  mrp: string;
  requiresPrescription: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/medicines?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-2 sm:mb-3">
            Medicine Search
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            Check real-time availability and stock status of medicines at Sharma Pharmacy.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine name, generic name..."
              className="flex-1 px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-base"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && results.length === 0 && (
          <div className="text-center py-10 sm:py-12 bg-slate-50 rounded-2xl">
            <div className="text-4xl sm:text-5xl mb-3">🔍</div>
            <p className="text-slate-500 mb-2">No medicines found for &quot;{query}&quot;</p>
            <p className="text-sm text-slate-400">
              Try a different name or{" "}
              <a
                href={`https://wa.me/918336027489?text=${encodeURIComponent(`Hi, I'm looking for: ${query}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline font-medium"
              >
                ask us on WhatsApp
              </a>
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {results.map((med) => (
              <div
                key={med.id}
                className="bg-white border border-slate-100 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Medicine Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-base sm:text-lg">
                        {med.name}
                      </h3>
                      {med.requiresPrescription && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
                          Rx Required
                        </span>
                      )}
                    </div>
                    {med.genericName && (
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Generic: {med.genericName}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500 flex-wrap">
                      {med.manufacturer && <span>{med.manufacturer}</span>}
                      {med.category && (
                        <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full text-xs">
                          {med.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Price & Stock */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-bold text-primary-700">
                        ₹{med.mrp}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-400">MRP</div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shrink-0 ${
                        med.quantity > 0
                          ? "bg-accent-50 text-accent-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {med.quantity > 0 ? "✓ In Stock" : "✕ Out of Stock"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!searched && (
          <div className="text-center py-10 sm:py-12 text-slate-400">
            <div className="text-5xl sm:text-6xl mb-4">💊</div>
            <p className="text-sm sm:text-base">Enter a medicine name to check availability</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-8 sm:mt-10 bg-accent-50 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-accent-800 font-medium mb-3 text-sm sm:text-base">
            Can&apos;t find what you need?
          </p>
          <a
            href={`https://wa.me/918336027489?text=${encodeURIComponent("Hi, I'm looking for medicines at Sharma Pharmacy.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-700 active:bg-accent-800 transition-colors"
          >
            💬 Ask on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
