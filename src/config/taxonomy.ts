export const cancerTypes: string[] = [
  "Rakovina prsníka",
  "Rakovina prostaty",
  "Rakovina pľúc",
  "Rakovina hrubého čreva a konečníka",
  "Rakovina krčka maternice",
  "Rakovina vaječníkov",
  "Rakovina kože (melanóm)",
  "Rakovina pankreasu",
  "Leukémia",
  "Lymfóm",
];

export const suspicionSymptoms: string[] = [
  "Nevysvetliteľné chudnutie",
  "Dlhodobý kašeľ alebo chrapot",
  "Krv v stolici alebo moči",
  "Zmeny na znamienkach alebo koži",
  "Hrčka alebo opuch na tele",
  "Dlhodobá únava",
];

export const treatmentTypes = [
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

export type TreatmentTypeLabel = (typeof treatmentTypes)[number];

export const preventionGeneralTopics: string[] = [
  "Zdravý životný štýl",
  "Fajčenie",
  "Alkohol",
  "Strava",
  "Pohyb",
  "Ochrana pred slnkom",
  "Očkovanie (HPV, hepatitída B)",
  "Pravidelné kontroly u lekára",
];

export const supportCategories: string[] = [
  "Pacientske organizácie",
  "Psychologická pomoc",
  "Finančná pomoc",
  "Sociálne dávky",
  "Právne informácie",
  "Pomoc pre rodinu",
  "Paliatívna starostlivosť",
  "Krízové kontakty",
];

