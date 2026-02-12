import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

const updateSchema = z
  .object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    excerpt: z.string().optional(),
    content: z.string().min(10).optional(),
    cancerType: z.string().min(1).optional(),
    stage: z.string().optional(),
    category: z.string().min(1).optional(),
    treatmentType: z.string().optional(),
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    videoUrl: z.string().url().optional().or(z.literal("")),
    isDraft: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Žiadne údaje na aktualizáciu.",
  });

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const admin = await getCurrentAdmin();
  
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return NextResponse.json({ message: "Článok nenájdený." }, { status: 404 });
  }

  // Admin can see all articles, public users only published ones
  if (!admin && !article.isPublished) {
    return NextResponse.json({ message: "Článok nenájdený." }, { status: 404 });
  }

  // Only increment view count for published articles viewed by non-admin users
  if (!admin && article.isPublished) {
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Neautorizovaný prístup." }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Neplatné údaje článku.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      stage: data.stage as any,
      category: data.category as any,
      treatmentType: data.treatmentType as any,
      imageUrl: data.imageUrl || null,
      videoUrl: data.videoUrl || null,
      publishedAt:
        typeof data.isPublished === "boolean"
          ? data.isPublished
            ? new Date()
            : null
          : undefined,
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Neautorizovaný prístup." }, { status: 401 });
  }

  const { id } = await params;
  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ message: "Článok bol vymazaný." });
}

