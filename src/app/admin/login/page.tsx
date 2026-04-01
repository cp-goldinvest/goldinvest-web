"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Pogrešan email ili lozinka.");
      setLoading(false);
    } else {
      router.push("/admin/cene");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#111112] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/logo.svg" alt="Gold Invest" width={200} height={60} className="mx-auto invert opacity-90" priority />
          <p className="text-xs text-[#555] mt-3 tracking-wider uppercase">Admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-8">
          <h1 className="text-lg font-semibold text-[#E9E6D9] mb-6">Prijavi se</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8A8A8A] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@goldinvest.rs"
                required
                className="w-full px-4 py-2.5 bg-[#111112] border border-[#2E2E2F] rounded-lg text-sm text-[#E9E6D9] placeholder-[#444] focus:outline-none focus:border-[#BF8E41]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8A8A8A] mb-1.5">Lozinka</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-[#111112] border border-[#2E2E2F] rounded-lg text-sm text-[#E9E6D9] placeholder-[#444] focus:outline-none focus:border-[#BF8E41]/60 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#1B1B1C] gold-gradient-bg hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
