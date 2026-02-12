import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Calendar, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  params: { id: string };
}) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť na domov
        </Link>
      </div>

      <article className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
              {article.cancerType}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
              {article.category}
            </span>
            {article.stage && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                {article.stage}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-slate-600">{article.excerpt}</p>
          )}

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
          <div className="relative h-96 w-full overflow-hidden rounded-3xl">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <Card className="prose prose-slate max-w-none space-y-4 rounded-3xl p-8 lg:prose-lg">
          <div
            className="whitespace-pre-wrap text-slate-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Card>

        {article.videoUrl && (
          <Card className="rounded-3xl p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Súvisiace video
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
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
