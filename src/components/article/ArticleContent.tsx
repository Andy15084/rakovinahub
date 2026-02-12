"use client";

import { sanitizeHtml } from "@/lib/sanitize";

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const safe = sanitizeHtml(html);
  return (
    <div
      className="prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-img:rounded-xl prose-img:max-w-full"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
