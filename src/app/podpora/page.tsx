import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cancerTypes, supportCategories } from "@/config/taxonomy";

export default function PodporaPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Pomoc a podpora
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Nájdete tu prehľad pacientskej, psychologickej, finančnej a sociálnej
          pomoci, ako aj informácie pre rodinu a o paliatívnej starostlivosti.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 1 – Aký typ rakoviny?
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {cancerTypes.map((type) => (
                <Chip key={type}>{type}</Chip>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Typy pomoci, ktoré nájdete
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {supportCategories.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

