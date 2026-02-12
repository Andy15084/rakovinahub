"use client";

import { useState, useMemo, useEffect } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { LatestArticlesClient } from "@/components/articles/LatestArticlesClient";
import {
  HeartPulse,
  HelpCircle,
  Shield,
  Stethoscope,
  Syringe,
  X,
  ChevronDown,
} from "lucide-react";
import { cancerTypes, suspicionSymptoms, treatmentTypes } from "@/config/taxonomy";
import { cn } from "@/lib/utils";

type FlowKey = "mam-rakovinu" | "podozrenie" | "liecba" | "prevencia" | "podpora";

const flows: {
  key: FlowKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "mam-rakovinu",
    label: "Mám rakovinu",
    description: "Získajte informácie podľa typu rakoviny a štádia.",
    icon: HeartPulse,
  },
  {
    key: "podozrenie",
    label: "Mám podozrenie, že mám rakovinu",
    description: "Zorientujte sa v príznakoch a ďalšom postupe.",
    icon: HelpCircle,
  },
  {
    key: "liecba",
    label: "Liečba",
    description: "Pozrite si prehľad liečby krok za krokom.",
    icon: Syringe,
  },
  {
    key: "prevencia",
    label: "Prevencia",
    description: "Ako znížiť riziko a čo sledovať.",
    icon: Shield,
  },
  {
    key: "podpora",
    label: "Pomoc a podpora",
    description: "Psychická, sociálna a praktická pomoc.",
    icon: Stethoscope,
  },
];

export default function Home() {
  const [activeFlow, setActiveFlow] = useState<FlowKey | null>(null);

  return (
    <div className="space-y-10">
        <section
          aria-label="Hlavné situácie"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5"
        >
        {flows.map((flow) => {
          const Icon = flow.icon;
          const isActive = activeFlow === flow.key;
          return (
            <button
              key={flow.key}
              type="button"
              onClick={() => setActiveFlow(flow.key)}
              className="flex items-center gap-4 rounded-3xl border border-white/30 bg-white/90 backdrop-blur-md px-5 py-4 text-left text-base shadow-lg ring-1 ring-white/20 transition hover:border-orange-200 hover:bg-white/95 hover:ring-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              aria-pressed={isActive}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  {flow.label}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {flow.description}
                </span>
              </span>
            </button>
          );
        })}
      </section>

      {/* Hero sekcia s videom a textom */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-3xl">
        {/* Video pozadie */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10 bg-black/20" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{
              filter: "brightness(0.95)",
            }}
          >
            <source
              src="/5803664_Coll_wavebreak_Doctor_3840x2160.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Obsah na vrchu videa */}
        <div className="relative z-20 flex w-full flex-col items-center justify-center px-4 py-12">
          <GlobalSearch />
          <div className="mx-auto mt-16 max-w-4xl space-y-3 text-center sm:text-left">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Slovenský onkologický informačný hub
            </p>
            <h1
              className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
            >
              Menej chaosu, viac istoty pri informáciách o rakovine.
            </h1>
            <p
              className="max-w-3xl text-balance text-sm text-white/95 sm:text-base"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Vyberte vašu situáciu alebo napíšte, čo hľadáte. Zobrazíme iba články,
              videá a overené zdroje, ktoré sa týkajú vašej konkrétnej situácie.
            </p>
            <p
              className="pt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
            >
              Vyhľadávanie v článkoch
            </p>
          </div>
        </div>
      </section>

      {/* Sekcia Novinky */}
      <LatestArticlesClient />

      {activeFlow && (
        <FlowOverlay flow={activeFlow} onClose={() => setActiveFlow(null)} />
      )}
    </div>
  );
}

type FlowOverlayProps = {
  flow: FlowKey;
  onClose: () => void;
};

function FlowOverlay({ flow, onClose }: FlowOverlayProps) {
  const flowDef = flows.find((f) => f.key === flow)!;
  const Icon = flowDef.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative h-full w-full max-w-6xl bg-white shadow-2xl lg:h-[90vh] lg:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5 lg:px-8 lg:py-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700 shadow-sm">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                Sprievodca
              </p>
              <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">
                {flowDef.label}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            aria-label="Zavrieť sprievodcu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-[calc(100%-5rem)] overflow-y-auto px-6 py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-4xl space-y-8">
            {flow === "mam-rakovinu" && <HaveCancerContent />}
            {flow === "podozrenie" && <SuspicionContent />}
            {flow === "liecba" && <TreatmentContent />}
            {flow === "prevencia" && <PreventionContent />}
            {flow === "podpora" && <SupportContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

function CancerTypeAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cancerTypes.slice(0, 5);
    return cancerTypes.filter((type) =>
      type.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (type: string) => {
    onChange(type);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const selected = filtered[activeIndex];
              if (selected) handleSelect(selected);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Napíšte typ rakoviny alebo vyberte z ponuky"
          className="w-full rounded-2xl border-2 border-amber-200 bg-white px-5 py-4 text-base shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <ChevronDown
            className={cn("h-5 w-5 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-amber-100 bg-white py-2 shadow-lg">
          {filtered.map((type, index) => (
            <li
              key={type}
              className={cn(
                "cursor-pointer px-5 py-3 text-sm transition",
                index === activeIndex
                  ? "bg-orange-50 text-orange-900"
                  : "text-slate-700 hover:bg-amber-50"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(type);
              }}
            >
              {type}
            </li>
          ))}
        </ul>
      )}
      {value && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-600">Vybrané:</span>
          <Chip selected>{value}</Chip>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-orange-600 hover:text-orange-700"
          >
            Zrušiť
          </button>
        </div>
      )}
    </div>
  );
}

function HaveCancerContent() {
  const [selectedCancerType, setSelectedCancerType] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const stages = [
    "Štádium 0",
    "Štádium I",
    "Štádium II",
    "Štádium III",
    "Štádium IV",
    "Neviem",
  ] as const;

  return (
    <>
      <div className="space-y-6 rounded-3xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-8 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 lg:text-xl">
            Krok 1 – Aký typ rakoviny máte?
          </h3>
          <p className="mt-2 text-sm text-slate-600 lg:text-base">
            Napíšte typ rakoviny, o ktorom vám hovoril váš lekár, alebo vyberte z
            ponuky. Ak si nie ste istí presným názvom, zvoľte ten, ktorý je mu
            najbližší.
          </p>
        </div>
        <CancerTypeAutocomplete
          value={selectedCancerType}
          onChange={setSelectedCancerType}
        />
      </div>

      <div className="space-y-6 rounded-3xl bg-slate-50 p-8 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 lg:text-xl">
            Krok 2 – V akom ste štádiu?
          </h3>
          <p className="mt-2 text-sm text-slate-600 lg:text-base">
            Ak poznáte štádium, pomôže to spresniť odporúčané informácie. Ak si nie
            ste istí, môžete zvoliť možnosť „Neviem“.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {stages.map((stage) => (
            <Chip
              key={stage}
              selected={selectedStage === stage}
              onClick={() =>
                setSelectedStage(selectedStage === stage ? "" : stage)
              }
            >
              {stage}
            </Chip>
          ))}
        </div>
      </div>
    </>
  );
}

function SuspicionContent() {
  return (
    <>
      <p className="text-sm text-slate-600">
        Táto časť je pre ľudí, ktorí majú obavy z možnej rakoviny – či už pre
        pretrvávajúce príznaky alebo rodinnú anamnézu. Cieľom je pomôcť vám
        zorientovať sa a pripraviť sa na prípadnú návštevu lekára.
      </p>

      <div className="space-y-3 rounded-2xl bg-amber-50/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
          Krok 1 – Viete, o aký typ rakoviny by mohlo ísť?
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip>Áno, mám podozrenie na konkrétny typ</Chip>
          <Chip>Nie, neviem</Chip>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Ak typ nepoznáte – vyberte príznaky
        </h3>
        <p>
          Vyberte príznaky, ktoré spozorujete. Sprievodca vám ukáže, kedy je
          vhodné navštíviť lekára a ako môže vyzerať ďalší postup.
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {suspicionSymptoms.map((symptom) => (
            <Chip key={symptom}>{symptom}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Čo sa dozviete
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Najčastejšie príznaky pri rôznych typoch rakoviny.</li>
          <li>
            Kedy je vhodné objednať sa k lekárovi a na aké vyšetrenia sa môžete
            pripraviť.
          </li>
          <li>Aké môžu byť aj iné, neonkologické príčiny príznakov.</li>
          <li>Odporúčaný ďalší postup a praktické tipy.</li>
        </ul>
      </div>
    </>
  );
}

function TreatmentContent() {
  return (
    <>
      <p className="text-sm text-slate-600">
        Táto sekcia sa sústreďuje na konkrétne typy liečby a to, čo môžete čakať
        pred nimi, počas nich aj po nich. Pomáha pripraviť sa prakticky aj
        psychicky.
      </p>

      <div className="space-y-3 rounded-2xl bg-amber-50/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
          Krok 1 – Aký typ rakoviny máte?
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {cancerTypes.map((type) => (
            <Chip key={type}>{type}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Krok 2 – Aký typ liečby podstupujete?
        </h3>
        <p>Vyberte jednu alebo viac možností, ktoré sa vás týkajú.</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {treatmentTypes.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Prehľad liečby krok za krokom
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Diagnostika a potrebné vyšetrenia.</li>
          <li>Biopsia a čo od nej očakávať.</li>
          <li>Operácia – priebeh, príprava a zotavenie.</li>
          <li>Chemoterapia, rádioterapia, imunoterapia a cielená liečba.</li>
          <li>Kontrolné vyšetrenia a obdobie remisie.</li>
        </ul>
      </div>
    </>
  );
}

function PreventionContent() {
  return (
    <>
      <p className="text-sm text-slate-600">
        Prevencia nie je o strachu, ale o starostlivosti o seba. Táto časť vám
        pomôže pochopiť, čo môžete ovplyvniť životným štýlom a aké vyšetrenia
        majú zmysel.
      </p>

      <div className="space-y-3 rounded-2xl bg-amber-50/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
          Krok 1 – Chcete informácie o konkrétnej rakovine alebo všeobecne?
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip>Konkrétna rakovina</Chip>
          <Chip>Všeobecne</Chip>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Ak konkrétna rakovina – výber typu
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {cancerTypes.map((type) => (
            <Chip key={type}>{type}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Všeobecná prevencia
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Zdravý životný štýl a pohyb.</li>
          <li>Fajčenie, alkohol a ich vplyv na riziko rakoviny.</li>
          <li>Strava, hmotnosť a ochrana pred slnkom.</li>
          <li>Očkovanie (napr. HPV, hepatitída B).</li>
          <li>Pravidelné preventívne prehliadky u lekára.</li>
        </ul>
      </div>
    </>
  );
}

function SupportContent() {
  const supportItems = [
    "Pacientske organizácie a podporné skupiny.",
    "Psychologická pomoc a krízové linky.",
    "Finančná pomoc a sociálne dávky.",
    "Právne informácie a pracovné právo.",
    "Podpora pre rodinu a blízkych.",
    "Paliatívna starostlivosť a starostlivosť na konci života.",
  ];

  return (
    <>
      <p className="text-sm text-slate-600">
        Nikto by nemal prechádzať diagnózou rakoviny sám. Táto časť zhromažďuje
        možnosti pomoci – od psychologickej podpory až po praktické informácie o
        financiách a právach pacienta.
      </p>

      <div className="space-y-3 rounded-2xl bg-amber-50/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
          Krok 1 – Aký typ rakoviny?
        </h3>
        <p className="text-sm text-amber-900/90">
          Niektoré pacientske organizácie a zdroje sú špecifické pre konkrétne
          typy rakoviny. Výber typu pomôže odporúčania lepšie prispôsobiť.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cancerTypes.map((type) => (
            <Chip key={type}>{type}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          Typy pomoci, ktoré môžete nájsť
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          {supportItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-orange-50/90 p-4 text-sm text-orange-900">
        Niekedy je prvým krokom len možnosť porozprávať sa s niekým, kto
        rozumie tomu, čím prechádzate. Sprievodca vám ponúkne kontakty a
        organizácie, na ktoré sa môžete obrátiť bez veľkých formalít a tlaku.
      </div>
    </>
  );
}

