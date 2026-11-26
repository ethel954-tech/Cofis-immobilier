import { creerDepotDemo } from "@/lib/donnees/depot";

export type StatutBail = "Brouillon" | "Actif" | "Expiré" | "Résilié";

export interface Bail {
  id: number;
  reference: string;
  locataireId: number;
  uniteId: number;
  dateDebut: string;
  dateFin: string;
  loyerMensuel: number;
  depotGarantie: number;
  statut: StatutBail;
  notes: string;
}

const bauxInitiaux: Bail[] = [
  { id: 401, reference: "BAIL-2026-001", locataireId: 301, uniteId: 201, dateDebut: "2026-01-01", dateFin: "2026-12-31", loyerMensuel: 175000, depotGarantie: 350000, statut: "Actif", notes: "Exemple fictif — bail résidentiel." },
  { id: 402, reference: "BAIL-2026-002", locataireId: 302, uniteId: 205, dateDebut: "2026-03-01", dateFin: "2027-02-28", loyerMensuel: 225000, depotGarantie: 450000, statut: "Brouillon", notes: "Exemple fictif — dossier à finaliser." }
];

function estDateIso(valeur: unknown): valeur is string {
  return typeof valeur === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valeur) &&
    !Number.isNaN(new Date(valeur + "T00:00:00").getTime());
}

function estBail(valeur: unknown): valeur is Bail {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.reference === "string" &&
    Number.isSafeInteger(element.locataireId) &&
    Number.isSafeInteger(element.uniteId) &&
    estDateIso(element.dateDebut) &&
    estDateIso(element.dateFin) &&
    element.dateFin >= element.dateDebut &&
    Number.isSafeInteger(element.loyerMensuel) &&
    Number(element.loyerMensuel) >= 0 &&
    Number.isSafeInteger(element.depotGarantie) &&
    Number(element.depotGarantie) >= 0 &&
    ["Brouillon", "Actif", "Expiré", "Résilié"].includes(String(element.statut)) &&
    typeof element.notes === "string";
}

function validerListeBaux(valeur: unknown): valeur is Bail[] {
  return Array.isArray(valeur) && valeur.every(estBail);
}

/** Dépôt local de démonstration ; conserve la clé historique des baux. */
export const depotBauxDemo = creerDepotDemo<Bail>({
  cle: "cofis_demo_baux_v1",
  valeursInitiales: bauxInitiaux,
  validerCollection: validerListeBaux
});
