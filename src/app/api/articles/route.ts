import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";

const articleFilterSchema = z.object({
  q: z.string().optional(),
  cancerType: z.string().optional(),
  stage: z.string().optional(),
  category: z.string().optional(),
  treatmentType: z.string().optional(),
  tags: z.string().optional(),
  sort: z.enum(["najnovsie", "najrelevantnejsie", "najcitanejsie"]).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  offset: z.coerce.number().min(0).optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const parsed = articleFilterSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Neplatné parametre vyhľadávania.", items: [], total: 0 },
        { status: 400 },
      );
    }

    const {
      q,
      cancerType,
      stage,
      category,
      treatmentType,
      tags,
      sort = "najrelevantnejsie",
      limit = 10,
      offset = 0,
    } = parsed.data;

    const where: any = {
      isPublished: true,
    };

    if (cancerType) where.cancerType = cancerType;
    if (stage) where.stage = stage;
    if (category) where.category = category;
    if (treatmentType) where.treatmentType = treatmentType;
    if (tags) where.tags = { hasSome: tags.split(",").map((t) => t.trim()) };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: [q] } },
      ];
    }

    let orderBy;
    if (sort === "najnovsie") {
      orderBy = { publishedAt: "desc" as const };
    } else if (sort === "najcitanejsie") {
      orderBy = { viewCount: "desc" as const };
    } else {
      orderBy = { publishedAt: "desc" as const };
    }

    let items, total;
    try {
      [items, total] = await Promise.all([
        prisma.article.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
          select: {
            id: true,
            title: true,
            excerpt: true,
            cancerType: true,
            stage: true,
            category: true,
            treatmentType: true,
            tags: true,
            publishedAt: true,
            viewCount: true,
            imageUrl: true,
          },
        }),
        prisma.article.count({ where }),
      ]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { items: [], total: 0, message: "Databáza nie je dostupná." },
        { status: 200 },
      );
    }

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { items: [], total: 0, message: "Chyba pri načítaní článkov." },
      { status: 200 },
    );
  }
}

const articleBodySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  cancerType: z.string().min(1),
  stage: z.string().optional(),
  category: z.string().min(1),
  treatmentType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  isDraft: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Neautorizovaný prístup." }, { status: 401 });
    }

    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json(
        { message: "Neplatný JSON v request body." },
        { status: 400 },
      );
    }

    const parsed = articleBodySchema.safeParse(json);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return NextResponse.json(
        { 
          message: "Neplatné údaje článku.", 
          issues: parsed.error.issues,
          received: json 
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    try {
      const article = await prisma.article.create({
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          cancerType: data.cancerType,
          stage: data.stage as any,
          category: data.category as any,
          treatmentType: data.treatmentType as any,
          tags: data.tags ?? [],
          imageUrl: data.imageUrl || null,
          videoUrl: data.videoUrl || null,
          isDraft: data.isDraft ?? true,
          isPublished: data.isPublished ?? false,
          publishedAt: data.isPublished ? new Date() : null,
        },
      });

      return NextResponse.json(article, { status: 201 });
    } catch (dbError) {
      console.error("Database error creating article:", dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : "Unknown database error";
      return NextResponse.json(
        { 
          message: "Chyba pri ukladaní článku do databázy.",
          error: errorMessage 
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in POST /api/articles:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        message: "Chyba pri vytváraní článku.",
        error: errorMessage 
      },
      { status: 500 },
    );
  }
}

