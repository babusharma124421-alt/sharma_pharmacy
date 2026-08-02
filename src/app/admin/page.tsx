"use client";

import { useState, useEffect } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-primary-600 font-bold text-3xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Sharma Pharmacy</h1>
          <p className="text-primary-200 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-base"
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-base"
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Default: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin</span> / <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">admin123</span>
            </p>
          </div>
        </form>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-primary-200 text-sm hover:text-white transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
