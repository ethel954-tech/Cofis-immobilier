import { creerDepotDemo } from "@/lib/donnees/depot";

export type TypeBien = "Résidentiel" | "Commercial" | "Mixte";

export interface Immeuble {
  id: number;
  nom: string;
  type: TypeBien;
  adresse: string;
  ville: string;
  proprietaireId: number;
  nombreUnites: number;
  statut: "Actif" | "Inactif";
}

const immeublesInitiaux: Immeuble[] = [
  { id: 101, nom: "Résidence Les Manguiers", type: "Résidentiel", adresse: "Quartier Bastos", ville: "Yaoundé", proprietaireId: 1, nombreUnites: 12, statut: "Actif" },
  { id: 102, nom: "Immeuble Bonapriso", type: "Mixte", adresse: "Rue Koloko, Bonapriso", ville: "Douala", proprietaireId: 2, nombreUnites: 8, statut: "Actif" },
  { id: 103, nom: "Centre commercial Étoile", type: "Commercial", adresse: "Avenue Kennedy", ville: "Yaoundé", proprietaireId: 2, nombreUnites: 15, statut: "Actif" }
];

function estImmeuble(valeur: unknown): valeur is Immeuble {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;

  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.nom === "string" &&
    (element.type === "Résidentiel" || element.type === "Commercial" || element.type === "Mixte") &&
    typeof element.adresse === "string" &&
    typeof element.ville === "string" &&
    Number.isSafeInteger(element.proprietaireId) &&
    Number.isSafeInteger(element.nombreUnites) &&
    Number(element.nombreUnites) >= 0 &&
    (element.statut === "Actif" || element.statut === "Inactif");
}

function validerListeImmeubles(valeur: unknown): valeur is Immeuble[] {
  return Array.isArray(valeur) && valeur.every(estImmeuble);
}

export const depotImmeublesDemo = creerDepotDemo<Immeuble>({
  cle: "cofis_demo_immeubles_v1",
  valeursInitiales: immeublesInitiaux,
  validerCollection: validerListeImmeubles
});
