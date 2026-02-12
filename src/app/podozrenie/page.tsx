import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { suspicionSymptoms } from "@/config/taxonomy";

const knowsTypes = ["Áno, poznám typ rakoviny", "Nie, neviem"] as const;

export default function PodozreniePage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Mám podozrenie, že mám rakovinu
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Tento sprievodca vám pomôže zorientovať sa v príznakoch, vysvetlí, kedy
          je čas navštíviť lekára a ako prebieha diagnostika.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <Card className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Krok 1 – Viete, o aký typ rakoviny ide?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {knowsTypes.map((k) => (
                <Chip key={k}>{k}</Chip>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Ak typ nepoznáte – vyberte príznaky
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Vyberte príznaky, ktoré pozorujete. Zobrazíme články a informácie,
              ktoré s nimi súvisia.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {suspicionSymptoms.map((symptom) => (
                <Chip key={symptom}>{symptom}</Chip>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Čo sa dozviete
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Najčastejšie príznaky pri rôznych typoch rakoviny</li>
            <li>Kedy je nevyhnutné navštíviť lekára</li>
            <li>Ako prebieha diagnostika a aké vyšetrenia sa robia</li>
            <li>Čo môžu príznaky znamenať aj mimo onkologického ochorenia</li>
            <li>Odporúčaný ďalší postup a na koho sa obrátiť</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

