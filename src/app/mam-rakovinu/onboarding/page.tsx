import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    title: "Čo znamená moja diagnóza?",
    body: "Jednoduché vysvetlenie pojmov z lekárskej správy – typ nádoru, štádium, receptory a iné odborné termíny.",
  },
  {
    title: "Čo bude nasledovať?",
    body: "Prehľad krokov od ďalších vyšetrení cez návrh liečby až po kontroly po ukončení liečby.",
  },
  {
    title: "Aké otázky sa mám spýtať lekára?",
    body: "Zoznam praktických otázok, ktoré si môžete vytlačiť alebo mať pri sebe na najbližšej kontrole.",
  },
  {
    title: "Prehľad celej liečby krok za krokom",
    body: "Chronologický prehľad diagnostiky, operácie, chemo-, rádio-, cielených a iných liečebných postupov.",
  },
  {
    title: "Psychická podpora",
    body: "Ako hovoriť o diagnóze, kde hľadať psychologickú pomoc a ako zapojiť rodinu a blízkych.",
  },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Práve mi diagnostikovali rakovinu
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Tento sprievodca vás krok za krokom prevedie prvými dňami po
          diagnostikovaní. Pomôže vám pochopiť, čo sa deje, čo očakávať a ako sa
          pripraviť na rozhovory s lekármi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title} className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {step.title}
            </h2>
            <p className="text-sm text-slate-600">{step.body}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button as-child size="lg">
          <Link href="/mam-rakovinu">Späť na výber typu rakoviny</Link>
        </Button>
        <p className="text-xs text-slate-500">
          Detailné články a videá budú prispôsobené podľa vašej diagnózy a
          štádia, ktoré zadáte v predchádzajúcom kroku.
        </p>
      </div>
    </div>
  );
}

