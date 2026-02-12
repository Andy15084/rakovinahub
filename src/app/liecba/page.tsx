import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cancerTypes, treatmentTypes } from "@/config/taxonomy";

const timeline = [
  "Diagnostika",
  "Biopsia",
  "Operácia",
  "Chemoterapia",
  "Rádioterapia",
  "Imunoterapia",
  "Cielená liečba",
  "Hormonálna liečba",
  "Kontrolné vyšetrenia",
  "Remisia a sledovanie",
] as const;

export default function LiecbaPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Liečba
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Tu nájdete prehľad liečby krok za krokom – od diagnostiky až po
          sledovanie v remisii. Obsah prispôsobíme typu rakoviny a liečbe,
          ktorú podstupujete.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 1 – Aký typ rakoviny máte?
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cancerTypes.map((type) => (
                <Chip key={type}>{type}</Chip>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 2 – Aký typ liečby podstupujete?
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {treatmentTypes.map((treatment) => (
                <Chip key={treatment}>{treatment}</Chip>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Chronologická štruktúra liečby
          </h2>
          <ol className="space-y-1 text-sm text-slate-700">
            {timeline.map((item, idx) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[2px] h-5 w-5 shrink-0 rounded-full bg-sky-50 text-center text-[11px] font-semibold text-sky-900">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-slate-500">
            Pre každú etapu vám zobrazíme: ako funguje, ako sa pripraviť, čo
            očakávať, vedľajšie účinky, dlhodobé následky a praktické tipy, ako
            liečbu zvládať.
          </p>
        </Card>
      </div>
    </div>
  );
}

