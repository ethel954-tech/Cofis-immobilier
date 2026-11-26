import { creerDepotDemo } from "@/lib/donnees/depot";

export const MODES_PAIEMENT = ["Espèces", "Virement bancaire", "Chèque", "Mobile Money", "Autre"] as const;
export type ModePaiement = (typeof MODES_PAIEMENT)[number];

export interface Paiement {
  id: number;
  reference: string;
  bailId: number;
  datePaiement: string;
  montant: number;
  mode: ModePaiement;
  referenceExterne: string;
  observation: string;
}

const paiementsInitiaux: Paiement[] = [
  { id: 501, reference: "PAY-DEMO-001", bailId: 401, datePaiement: "2026-11-05", montant: 175000, mode: "Virement bancaire", referenceExterne: "VIR-DEMO-0511", observation: "Exemple fictif de paiement enregistré." },
  { id: 502, reference: "PAY-DEMO-002", bailId: 401, datePaiement: "2026-10-05", montant: 100000, mode: "Mobile Money", referenceExterne: "", observation: "Exemple fictif — aucun rapprochement effectué." }
];

function estDateIso(valeur: unknown): valeur is string {
  if (typeof valeur !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) return false;
  const date = new Date(valeur + "T00:00:00.000Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === valeur;
}

function estPaiement(valeur: unknown): valeur is Paiement {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.reference === "string" &&
    Number.isSafeInteger(element.bailId) &&
    estDateIso(element.datePaiement) &&
    Number.isSafeInteger(element.montant) &&
    Number(element.montant) > 0 &&
    MODES_PAIEMENT.includes(element.mode as ModePaiement) &&
    typeof element.referenceExterne === "string" &&
    typeof element.observation === "string";
}

function validerListePaiements(valeur: unknown): valeur is Paiement[] {
  return Array.isArray(valeur) && valeur.every(estPaiement);
}

/** Dépôt local de démonstration ; conserve la clé historique des paiements. */
export const depotPaiementsDemo = creerDepotDemo<Paiement>({
  cle: "cofis_demo_paiements_v1",
  valeursInitiales: paiementsInitiaux,
  validerCollection: validerListePaiements
});
