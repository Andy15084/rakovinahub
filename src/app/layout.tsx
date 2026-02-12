import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnkoNavigátor",
  description:
    "Slovenský informačný hub o rakovine s inteligentným filtrovaním a sprievodcom krok za krokom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <div className="min-h-screen bg-transparent">
          <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
