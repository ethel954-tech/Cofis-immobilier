import { creerDepotDemo } from "@/lib/donnees/depot";

export type TypeProprietaire = "Particulier" | "Société";

export interface Proprietaire {
  id: number;
  nom: string;
  type: TypeProprietaire;
  telephone: string;
  email: string;
  ville: string;
  biens: number;
}

const proprietairesInitiaux: Proprietaire[] = [
  { id: 1, nom: "Exemple — Jean Mbarga", type: "Particulier", telephone: "+237 6 90 00 00 01", email: "jean.exemple@cofis.cm", ville: "Yaoundé", biens: 3 },
  { id: 2, nom: "Exemple — Société Immobilière", type: "Société", telephone: "+237 6 90 00 00 02", email: "contact.exemple@cofis.cm", ville: "Douala", biens: 8 },
  { id: 3, nom: "Exemple — Marie Nguemo", type: "Particulier", telephone: "+237 6 90 00 00 03", email: "marie.exemple@cofis.cm", ville: "Bafoussam", biens: 1 }
];

function estProprietaire(valeur: unknown): valeur is Proprietaire {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    return false;
  }

  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.nom === "string" &&
    (element.type === "Particulier" || element.type === "Société") &&
    typeof element.telephone === "string" &&
    typeof element.email === "string" &&
    typeof element.ville === "string" &&
    Number.isSafeInteger(element.biens) &&
    Number(element.biens) >= 0;
}

function validerListeProprietaires(valeur: unknown): valeur is Proprietaire[] {
  return Array.isArray(valeur) && valeur.every(estProprietaire);
}

export const depotProprietairesDemo = creerDepotDemo<Proprietaire>({
  cle: "cofis_demo_proprietaires_v1",
  valeursInitiales: proprietairesInitiaux,
  validerCollection: validerListeProprietaires
});
