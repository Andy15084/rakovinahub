"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancerTypes, treatmentTypes } from "@/config/taxonomy";

const categories = [
  { value: "DIAGNOSTICS", label: "Diagnostika" },
  { value: "TREATMENT", label: "Liečba" },
  { value: "SIDE_EFFECTS", label: "Vedľajšie účinky" },
  { value: "LIFE_DURING_TREATMENT", label: "Život počas liečby" },
  { value: "PREVENTION", label: "Prevencia" },
  { value: "MENTAL_SUPPORT", label: "Psychická podpora" },
  { value: "SOCIAL_SUPPORT", label: "Sociálna pomoc" },
  { value: "GENERAL_INFO", label: "Základné informácie" },
  { value: "STAGE_SPECIFIC", label: "Informácie podľa štádia" },
  { value: "CLINICAL_TRIALS", label: "Klinické štúdie" },
  { value: "FAQ", label: "Často kladené otázky" },
  { value: "SUPPORT_SERVICES", label: "Pomoc a podpora" },
] as const;

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setError(null);

    const body = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      cancerType: String(formData.get("cancerType") ?? ""),
      stage: String(formData.get("stage") ?? "") || undefined,
      category: String(formData.get("category") ?? ""),
      treatmentType: String(formData.get("treatmentType") ?? "") || undefined,
      tags:
        String(formData.get("tags") ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean) ?? [],
      imageUrl: String(formData.get("imageUrl") ?? ""),
      videoUrl: String(formData.get("videoUrl") ?? ""),
      isDraft: formData.get("status") === "draft",
      isPublished: formData.get("status") === "published",
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const errorMessage = data?.message || data?.error || "Uloženie článku zlyhalo.";
        const issues = data?.issues ? `\nDetaily: ${JSON.stringify(data.issues, null, 2)}` : "";
        setError(`${errorMessage}${issues}`);
        console.error("Error saving article:", data);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Uloženie článku zlyhalo. Skúste to znova.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Nový článok
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Vyplňte štruktúrované informácie, aby bolo možné článok inteligentne
            filtrovať.
          </p>
        </div>
      </div>

      <Card className="space-y-5">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Názov článku
              </label>
              <input
                name="title"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Slug (URL)
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
              Krátky úvod / perex
            </label>
            <textarea
              name="excerpt"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
              Obsah článku
            </label>
            <textarea
              name="content"
              rows={8}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Typ rakoviny
              </label>
              <select
                name="cancerType"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              >
                <option value="">Vyberte</option>
                {cancerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Štádium
              </label>
              <select
                name="stage"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              >
                <option value="">Nezadané</option>
                <option value="STAGE_0">Štádium 0</option>
                <option value="STAGE_I">Štádium I</option>
                <option value="STAGE_II">Štádium II</option>
                <option value="STAGE_III">Štádium III</option>
                <option value="STAGE_IV">Štádium IV</option>
                <option value="UNKNOWN">Neviem</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Kategória
              </label>
              <select
                name="category"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              >
                <option value="">Vyberte</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Typ liečby (voliteľné)
              </label>
              <select
                name="treatmentType"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              >
                <option value="">Neurčené</option>
                {treatmentTypes.map((t) => (
                  <option key={t} value={t.toUpperCase().replace(/ /g, "_")}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Tagy
              </label>
              <input
                name="tags"
                placeholder="napr. diagnostika, vedľajšie účinky"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
              <p className="text-xs text-slate-500">
                Viac tagov oddeľte čiarkou. Pomáhajú pri vyhľadávaní.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                Stav
              </label>
              <select
                name="status"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
                defaultValue="draft"
              >
                <option value="draft">Uložiť ako koncept</option>
                <option value="published">Publikovať</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                URL obrázka (voliteľné)
              </label>
              <input
                name="imageUrl"
                type="url"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-700">
                URL videa (YouTube a pod., voliteľné)
              </label>
              <input
                name="videoUrl"
                type="url"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/admin")}
            >
              Zrušiť
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Ukladám…" : "Uložiť článok"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

