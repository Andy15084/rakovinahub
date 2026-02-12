import { redirect } from "next/navigation";
import { getCurrentAdmin, ensureDefaultAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData() {
  try {
    await ensureDefaultAdminUser();
  } catch (error) {
    console.error("Error ensuring default admin user:", error);
    // Continue even if default admin creation fails
  }

  try {
    const [admin, articles] = await Promise.all([
      getCurrentAdmin(),
      prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          cancerType: true,
          category: true,
          isPublished: true,
          publishedAt: true,
        },
      }),
    ]);

    return { admin, articles };
  } catch (error) {
    console.error("Error fetching admin data:", error);
    // Return empty state if database query fails
    return { admin: null, articles: [] };
  }
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { admin, articles } = await getData();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin – články
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Prihlásený: <span className="font-medium">{admin.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action="/api/admin/logout" method="post">
            <Button type="submit" variant="ghost">
              Odhlásiť sa
            </Button>
          </form>
          <Link href="/admin/novy-clanok">
            <Button>Pridať článok</Button>
          </Link>
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Posledné články</h2>
          <p className="text-xs text-slate-500">
            Zobrazených je maximálne 20 posledných článkov.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {articles.length === 0 && (
            <p className="py-4 text-sm text-slate-500">
              Zatiaľ neboli pridané žiadne články.
            </p>
          )}
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {article.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {article.cancerType} · {article.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    article.isPublished
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {article.isPublished ? "Publikovaný" : "Koncept"}
                </span>
                <Link href={`/admin/clanky/${article.id}`}>
                  <Button size="md" variant="ghost">Upraviť</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

