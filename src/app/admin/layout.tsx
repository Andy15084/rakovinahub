import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="text-lg font-semibold text-slate-900 hover:text-orange-600"
          >
            Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/novy-clanok"
              className="text-sm font-medium text-slate-600 hover:text-orange-600"
            >
              Nový článok
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-orange-600"
            >
              Na stránku
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
