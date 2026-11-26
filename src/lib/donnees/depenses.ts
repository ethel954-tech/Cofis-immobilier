import { creerDepotDemo } from "@/lib/donnees/depot";

export const CATEGORIES_DEPENSES = [
  "Entretien",
  "Réparation",
  "Nettoyage",
  "Sécurité",
  "Services",
  "Frais administratifs",
  "Autre"
] as const;
export type CategorieDepense = (typeof CATEGORIES_DEPENSES)[number];

export interface Depense {
  id: number;
  reference: string;
  dateDepense: string;
  categorie: CategorieDepense;
  description: string;
  fournisseur: string;
  montant: number;
  referenceJustificatif: string;
}

const depensesInitiales: Depense[] = [
  { id: 601, reference: "DEP-DEMO-001", dateDepense: "2026-11-03", categorie: "Entretien", description: "Réparation d'une fuite — exemple fictif", fournisseur: "Plomberie Exemple", montant: 45000, referenceJustificatif: "FACT-DEMO-03" },
  { id: 602, reference: "DEP-DEMO-002", dateDepense: "2026-11-08", categorie: "Nettoyage", description: "Nettoyage des parties communes — exemple fictif", fournisseur: "Services Propreté", montant: 25000, referenceJustificatif: "" }
];

function estDateIso(valeur: unknown): valeur is string {
  if (typeof valeur !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(valeur + "T00:00:00.000Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur;
}

function estDepense(valeur: unknown): valeur is Depense {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.reference === "string" &&
    estDateIso(element.dateDepense) &&
    CATEGORIES_DEPENSES.includes(element.categorie as CategorieDepense) &&
    typeof element.description === "string" &&
    typeof element.fournisseur === "string" &&
    Number.isSafeInteger(element.montant) &&
    Number(element.montant) > 0 &&
    typeof element.referenceJustificatif === "string";
}

function validerListeDepenses(valeur: unknown): valeur is Depense[] {
  return Array.isArray(valeur) && valeur.every(estDepense);
}

/** Dépôt local de démonstration ; conserve la clé historique des dépenses. */
export const depotDepensesDemo = creerDepotDemo<Depense>({
  cle: "cofis_demo_depenses_v1",
  valeursInitiales: depensesInitiales,
  validerCollection: validerListeDepenses
});
