"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { cancerTypes, suspicionSymptoms, treatmentTypes } from "@/config/taxonomy";

type Suggestion = {
  label: string;
  type: "typ rakoviny" | "príznak" | "liečba" | "kategória";
};

const staticSuggestions: Suggestion[] = [
  ...cancerTypes.map((label) => ({ label, type: "typ rakoviny" as const })),
  ...suspicionSymptoms.map((label) => ({ label, type: "príznak" as const })),
  ...treatmentTypes.map((label) => ({ label, type: "liečba" as const })),
  { label: "Prevencia", type: "kategória" },
  { label: "Vedľajšie účinky", type: "kategória" },
  { label: "Psychická podpora", type: "kategória" },
];

type Props = {
  onSubmit?: (value: string) => void;
};

export function GlobalSearch({ onSubmit }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staticSuggestions.slice(0, 6);
    return staticSuggestions
      .filter((s) => s.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (value: string) => {
    setQuery(value);
    setOpen(false);
    onSubmit?.(value);
  };

  return (
    <div className="relative w-full max-w-3xl">
      <label className="sr-only" htmlFor="global-search">
        Vyhľadávanie v článkoch
      </label>
      <div
        className={cn(
          "flex items-center gap-4 rounded-full border border-amber-200 bg-white px-6 py-4 shadow-sm",
          "focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2",
        )}
      >
        <Search className="h-6 w-6 text-amber-500" aria-hidden="true" />
        <input
          id="global-search"
          className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400"
          placeholder="Napíšte napríklad: rakovina prsníka, chemoterapia, vedľajšie účinky…"
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
              const value = filtered[activeIndex]?.label || query;
              handleSelect(value);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="global-search-listbox"
        />
      </div>
      {open && filtered.length > 0 && (
        <ul
          id="global-search-listbox"
          role="listbox"
          className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-lg"
        >
          {filtered.map((s, index) => (
            <li
              key={`${s.type}-${s.label}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex cursor-pointer items-center justify-between px-4 py-2 text-sm",
                index === activeIndex ? "bg-sky-50" : "hover:bg-slate-50",
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s.label);
              }}
            >
              <span className="text-slate-900">{s.label}</span>
              <span className="text-xs text-slate-500">{s.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

