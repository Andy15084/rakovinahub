import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { cancerTypes } from "@/config/taxonomy";
import Link from "next/link";

const stages = [
  "Štádium 0",
  "Štádium I",
  "Štádium II",
  "Štádium III",
  "Štádium IV",
  "Neviem",
] as const;

function StageContent() {
  // Neskôr sa napojí na API /api/articles s filtrami.
  return (
    <div className="mt-6 space-y-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">Čo uvidíte po výbere:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Základné informácie o vašom type rakoviny</li>
        <li>Možnosti liečby a vysvetlenie jednotlivých prístupov</li>
        <li>Odporúčania podľa štádia ochorenia</li>
        <li>Vedľajšie účinky a ako ich zvládať</li>
        <li>Život počas liečby a praktické tipy</li>
        <li>Články, videá, klinické štúdie a často kladené otázky</li>
      </ul>
    </div>
  );
}

export default function MamRakovinuPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Mám rakovinu
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Pomôžeme vám zorientovať sa v diagnóze, štádiu ochorenia a možnostiach
          liečby. Všetok obsah prispôsobíme vašej situácii.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 1 – Aký typ rakoviny máte?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Vyberte z najčastejších typov rakoviny alebo začnite písať názov
              diagnózy.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cancerTypes.map((type) => (
                <Chip key={type}>{type}</Chip>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 2 – V akom ste štádiu?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Ak si nie ste istí, zvoľte možnosť „Neviem“. Obsah tomu prispôsobíme.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Chip key={stage}>{stage}</Chip>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <Button variant="secondary" fullWidth size="lg" as-child>
              <Link href="/mam-rakovinu/onboarding">
                Práve mi diagnostikovali rakovinu – prevedie ma to
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Čo uvidíte po vyplnení
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Obsah prispôsobíme podľa typu rakoviny a štádia ochorenia, aby ste
              nemuseli prechádzať stovky nerelevantných článkov.
            </p>
          </div>
          <Suspense fallback={<p className="text-sm text-slate-500">Načítavam obsah…</p>}>
            <StageContent />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

