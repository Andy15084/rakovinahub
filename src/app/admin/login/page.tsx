"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Prihlásenie zlyhalo.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Prihlásenie zlyhalo. Skúste to znova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Admin – prihlásenie</h1>
          <p className="mt-2 text-sm text-slate-600">
            Prístup do redakčného rozhrania na správu článkov.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wide text-slate-700"
            >
              E‑mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wide text-slate-700"
            >
              Heslo
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Prihlasujem…" : "Prihlásiť sa"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

