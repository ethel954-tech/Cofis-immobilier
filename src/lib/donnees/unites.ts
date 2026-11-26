import { creerDepotDemo } from "@/lib/donnees/depot";

export type StatutUnite = "Disponible" | "Occupée" | "En maintenance" | "Inactive";
export type TypeUnite = "Appartement" | "Studio" | "Bureau" | "Boutique" | "Entrepôt" | "Autre";

export interface Unite {
  id: number;
  reference: string;
  immeubleId: number;
  type: TypeUnite;
  etage: string;
  surface: number | null;
  loyerMensuel: number;
  statut: StatutUnite;
}

const unitesInitiales: Unite[] = [
  { id: 201, reference: "LM-A01", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 85, loyerMensuel: 175000, statut: "Occupée" },
  { id: 202, reference: "LM-A02", immeubleId: 101, type: "Appartement", etage: "1er étage", surface: 72, loyerMensuel: 150000, statut: "Disponible" },
  { id: 203, reference: "LM-S01", immeubleId: 101, type: "Studio", etage: "Rez-de-chaussée", surface: 38, loyerMensuel: 85000, statut: "En maintenance" },
  { id: 204, reference: "IB-B03", immeubleId: 102, type: "Bureau", etage: "3e étage", surface: 110, loyerMensuel: 300000, statut: "Occupée" },
  { id: 205, reference: "CE-B01", immeubleId: 103, type: "Boutique", etage: "Rez-de-chaussée", surface: 45, loyerMensuel: 225000, statut: "Disponible" }
];

function estUnite(valeur: unknown): valeur is Unite {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;

  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.reference === "string" &&
    Number.isSafeInteger(element.immeubleId) &&
    ["Appartement", "Studio", "Bureau", "Boutique", "Entrepôt", "Autre"].includes(String(element.type)) &&
    typeof element.etage === "string" &&
    (element.surface === null || (typeof element.surface === "number" && Number.isFinite(element.surface) && element.surface > 0)) &&
    Number.isSafeInteger(element.loyerMensuel) &&
    Number(element.loyerMensuel) >= 0 &&
    ["Disponible", "Occupée", "En maintenance", "Inactive"].includes(String(element.statut));
}

function validerListeUnites(valeur: unknown): valeur is Unite[] {
  return Array.isArray(valeur) && valeur.every(estUnite);
}

export const depotUnitesDemo = creerDepotDemo<Unite>({
  cle: "cofis_demo_unites_v1",
  valeursInitiales: unitesInitiales,
  validerCollection: validerListeUnites
});
