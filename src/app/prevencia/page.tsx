import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cancerTypes, preventionGeneralTopics } from "@/config/taxonomy";

const options = ["Konkrétna rakovina", "Všeobecne"] as const;

export default function PrevenciaPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Prevencia
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Zistite, ako znížiť riziko vzniku rakoviny, aké preventívne
          prehliadky sú dostupné a čo môžete ovplyvniť vo svojom životnom štýle.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 1 – Chcete informácie o konkrétnej rakovine alebo všeobecne?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {options.map((option) => (
                <Chip key={option}>{option}</Chip>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Konkrétna rakovina – vyberte typ
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
            Všeobecná prevencia
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {preventionGeneralTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

