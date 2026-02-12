"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancerTypes, treatmentTypes } from "@/config/taxonomy";
import Link from "next/link";

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

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cancerType: string;
  stage: string | null;
  category: string;
  treatmentType: string | null;
  tags: string[];
  imageUrl: string | null;
  videoUrl: string | null;
  isDraft: boolean;
  isPublished: boolean;
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        if (!res.ok) {
          setError("Článok sa nepodarilo načítať.");
          return;
        }
        const data = await res.json();
        setArticle(data);
      } catch {
        setError("Chyba pri načítaní článku.");
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setError(null);

    const body = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? "") || undefined,
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
      imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
      videoUrl: String(formData.get("videoUrl") ?? "") || undefined,
      isDraft: formData.get("status") === "draft",
      isPublished: formData.get("status") === "published",
    };

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Uloženie článku zlyhalo.");
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

  const handleDelete = async () => {
    if (!confirm("Naozaj chcete vymazať tento článok?")) return;

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Vymazanie článku zlyhalo.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Vymazanie článku zlyhalo.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-600">Načítavam článok...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-600">
          {error || "Článok sa nepodarilo načítať."}
        </p>
        <Link href="/admin">
          <Button variant="ghost">Späť na admin</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Upraviť článok
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upravte štruktúrované informácie článku.
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
                defaultValue={article.title}
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
                defaultValue={article.slug}
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
              defaultValue={article.excerpt || ""}
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
              defaultValue={article.content}
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
                defaultValue={article.cancerType}
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
                defaultValue={article.stage || ""}
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
                defaultValue={article.category}
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
                defaultValue={article.treatmentType || ""}
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
                defaultValue={article.tags.join(", ")}
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
                defaultValue={article.isPublished ? "published" : "draft"}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
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
                defaultValue={article.imageUrl || ""}
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
                defaultValue={article.videoUrl || ""}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-700 ring-offset-2 focus:border-sky-500 focus:ring-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              Vymazať článok
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin")}
              >
                Zrušiť
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Ukladám…" : "Uložiť zmeny"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
