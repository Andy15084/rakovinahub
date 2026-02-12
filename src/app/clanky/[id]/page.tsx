import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleContent } from "@/components/article/ArticleContent";
import { categoryLabels, stageLabels } from "@/config/labels";

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || !article.isPublished) {
    return null;
  }

  await prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return article;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  const cancerLabels = article.cancerTypes;
  const categoryLabelsList = (article.categories || []).map(
    (c) => categoryLabels[c] ?? c
  );
  const stageLabelsList = (article.stages || []).map(
    (s) => stageLabels[s] ?? s
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť na domov
        </Link>
      </div>

      <article className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {cancerLabels.length > 0 &&
              cancerLabels.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800"
                >
                  {c}
                </span>
              ))}
            {categoryLabelsList.length > 0 &&
              categoryLabelsList.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                >
                  {c}
                </span>
              ))}
            {stageLabelsList.length > 0 &&
              stageLabelsList.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800"
                >
                  {s}
                </span>
              ))}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.viewCount} zobrazení
            </span>
          </div>
        </div>

        {article.imageUrl && (
          <div className="relative h-80 w-full overflow-hidden rounded-2xl">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <Card className="rounded-2xl border-slate-200 bg-white p-8 shadow-sm">
          <ArticleContent html={article.content} />
        </Card>

        {article.videoUrl && (
          <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Súvisiace video
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                src={article.videoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Card>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
