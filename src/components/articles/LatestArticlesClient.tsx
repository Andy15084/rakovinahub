"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  cancerType: string;
  category: string;
  publishedAt: string | null;
  viewCount: number;
  imageUrl: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function LatestArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles?limit=3&sort=najnovsie");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setArticles(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="relative z-10 space-y-6 py-12">
        <h2
          className="text-2xl font-semibold tracking-tight text-white lg:text-3xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          Novinky
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-3xl bg-white/20"
            />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="relative z-10 space-y-6 py-12">
        <h2
          className="text-2xl font-semibold tracking-tight text-white lg:text-3xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          Novinky
        </h2>
        <p className="text-white/80">
          Zatiaľ nie sú k dispozícii žiadne publikované články.
        </p>
      </section>
    );
  }

  return (
    <section className="relative z-10 space-y-6 py-12">
      <h2
        className="text-2xl font-semibold tracking-tight text-white lg:text-3xl"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
      >
        Novinky
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/clanky/${article.id}`} prefetch>
            <Card className="group h-full cursor-pointer space-y-3 rounded-3xl border-white/20 bg-white/90 p-6 shadow-lg backdrop-blur-md transition hover:bg-white hover:shadow-xl">
              {article.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-800">
                    {article.cancerType}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800">
                    {article.category}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-orange-700">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="line-clamp-2 text-sm text-slate-600">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.viewCount}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
