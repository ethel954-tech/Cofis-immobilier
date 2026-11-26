import { creerDepotDemo } from "@/lib/donnees/depot";

export const CATEGORIES_INTERVENTION = [
  "Plomberie", "Électricité", "Menuiserie", "Nettoyage", "Sécurité", "Entretien", "Autre"
] as const;
export const PRIORITES_INTERVENTION = ["Basse", "Normale", "Urgente"] as const;
export const STATUTS_INTERVENTION = ["Nouvelle", "Planifiée", "En cours", "Terminée"] as const;

export type CategorieIntervention = (typeof CATEGORIES_INTERVENTION)[number];
export type PrioriteIntervention = (typeof PRIORITES_INTERVENTION)[number];
export type StatutIntervention = (typeof STATUTS_INTERVENTION)[number];

export interface Intervention {
  id: number;
  reference: string;
  immeuble: string;
  logement: string;
  categorie: CategorieIntervention;
  priorite: PrioriteIntervention;
  dateSignalement: string;
  description: string;
  statut: StatutIntervention;
}

const interventionsInitiales: Intervention[] = [
  { id: 1, reference: "INT-DEMO-001", immeuble: "Résidence Les Manguiers", logement: "LM-A01", categorie: "Plomberie", priorite: "Urgente", dateSignalement: "2026-11-18", description: "Fuite signalée sous l'évier de la cuisine (exemple fictif).", statut: "En cours" },
  { id: 2, reference: "INT-DEMO-002", immeuble: "Immeuble Bonapriso", logement: "IB-B03", categorie: "Électricité", priorite: "Normale", dateSignalement: "2026-11-20", description: "Vérification d'un interrupteur dans le séjour.", statut: "Planifiée" },
  { id: 3, reference: "INT-DEMO-003", immeuble: "Résidence Les Manguiers", logement: "Parties communes", categorie: "Entretien", priorite: "Basse", dateSignalement: "2026-11-21", description: "Remplacement d'une ampoule dans l'escalier.", statut: "Terminée" }
];

function estDateIso(valeur: unknown): valeur is string {
  if (typeof valeur !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(valeur + "T00:00:00.000Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur;
}

function estIntervention(valeur: unknown): valeur is Intervention {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.reference === "string" &&
    typeof element.immeuble === "string" &&
    typeof element.logement === "string" &&
    CATEGORIES_INTERVENTION.includes(element.categorie as CategorieIntervention) &&
    PRIORITES_INTERVENTION.includes(element.priorite as PrioriteIntervention) &&
    estDateIso(element.dateSignalement) &&
    typeof element.description === "string" &&
    STATUTS_INTERVENTION.includes(element.statut as StatutIntervention);
}

function validerListeInterventions(valeur: unknown): valeur is Intervention[] {
  return Array.isArray(valeur) && valeur.every(estIntervention);
}

/** Dépôt local de démonstration ; conserve la clé historique de maintenance. */
export const depotMaintenanceDemo = creerDepotDemo<Intervention>({
  cle: "cofis_demo_maintenance_v1",
  valeursInitiales: interventionsInitiales,
  validerCollection: validerListeInterventions
});
