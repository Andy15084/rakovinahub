"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { cancerTypes, treatmentTypes } from "@/config/taxonomy";
import { cn } from "@/lib/utils";

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

const stages = [
  { value: "STAGE_0", label: "Štádium 0" },
  { value: "STAGE_I", label: "Štádium I" },
  { value: "STAGE_II", label: "Štádium II" },
  { value: "STAGE_III", label: "Štádium III" },
  { value: "STAGE_IV", label: "Štádium IV" },
  { value: "UNKNOWN", label: "Neviem" },
] as const;

const treatmentEnumMap: Record<string, string> = {
  Diagnostika: "DIAGNOSTICS",
  Biopsia: "BIOPSY",
  Operácia: "SURGERY",
  Chemoterapia: "CHEMOTHERAPY",
  Rádioterapia: "RADIOTHERAPY",
  Imunoterapia: "IMMUNOTHERAPY",
  "Cielená liečba": "TARGETED_THERAPY",
  "Hormonálna liečba": "HORMONE_THERAPY",
  "Kontrolné vyšetrenia": "FOLLOW_UP",
  "Remisia a sledovanie": "REMISSION",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [selectedCancers, setSelectedCancers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const toggleMulti = (
    arr: string[],
    set: (v: string[]) => void,
    value: string
  ) => {
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      content,
      cancerTypes: selectedCancers,
      stages: selectedStages,
      categories: selectedCategories,
      treatmentTypes: selectedTreatments,
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
      videoUrl: String(formData.get("videoUrl") ?? "") || undefined,
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
        setError(data?.message || "Uloženie článku zlyhalo.");
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Nový článok</h1>
        <p className="mt-1 text-sm text-slate-600">
          Vyplňte informácie a vložte obsah. Môžete vložiť text z Wordu vrátane obrázkov.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 space-y-6 rounded-2xl border-slate-200 bg-white shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Názov článku
              </label>
              <input
                name="title"
                required
                onChange={(e) => {
                  const slug = formRef.current?.querySelector('[name="slug"]') as HTMLInputElement;
                  if (slug && !slug.value) slug.value = slugify(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                placeholder="Zadajte názov"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Slug (URL)
              </label>
              <input
                name="slug"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                placeholder="url-clanku"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Obsah článku
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Vložte text z Wordu alebo iného editora. Formátovanie a obrázky sa zachovajú.
            </p>
            <RichTextEditor
              value={content}
              onChange={setContent}
              minHeight="400px"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-6 rounded-2xl border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-medium text-slate-900">Metadáta</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Typy rakoviny (viacero)
            </label>
            <div className="flex flex-wrap gap-2">
              {cancerTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleMulti(selectedCancers, setSelectedCancers, type)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    selectedCancers.includes(type)
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategórie (viacero)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => toggleMulti(selectedCategories, setSelectedCategories, cat.value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    selectedCategories.includes(cat.value)
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Štádiá (voliteľné)
            </label>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleMulti(selectedStages, setSelectedStages, s.value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    selectedStages.includes(s.value)
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Typy liečby (voliteľné)
            </label>
            <div className="flex flex-wrap gap-2">
              {treatmentTypes.map((t) => {
                const val = treatmentEnumMap[t] ?? t.toUpperCase().replace(/ /g, "_");
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleMulti(selectedTreatments, setSelectedTreatments, val)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      selectedTreatments.includes(val)
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tagy (čiarkou oddelené)
              </label>
              <input
                name="tags"
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                placeholder="diagnostika, liečba"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stav
              </label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              >
                <option value="draft">Koncept</option>
                <option value="published">Publikovať</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                URL obrázka
              </label>
              <input
                name="imageUrl"
                type="url"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                URL videa
              </label>
              <input
                name="videoUrl"
                type="url"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => router.push("/admin")}>
            Zrušiť
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Ukladám…" : "Uložiť článok"}
          </Button>
        </div>
      </form>
    </div>
  );
}
