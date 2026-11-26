import { creerDepotDemo } from "@/lib/donnees/depot";

export type TypeLocataire = "Particulier" | "Entreprise";
export type StatutLocataire = "Prospect" | "Actif" | "Inactif";

export interface Locataire {
  id: number;
  nom: string;
  type: TypeLocataire;
  telephone: string;
  email: string;
  ville: string;
  statut: StatutLocataire;
}

const locatairesInitiaux: Locataire[] = [
  { id: 301, nom: "Exemple — Alice Tchoumi", type: "Particulier", telephone: "+237 6 70 00 00 11", email: "alice.exemple@cofis.cm", ville: "Yaoundé", statut: "Actif" },
  { id: 302, nom: "Exemple — Cabinet Horizon", type: "Entreprise", telephone: "+237 6 90 00 00 22", email: "contact.horizon@cofis.cm", ville: "Douala", statut: "Prospect" },
  { id: 303, nom: "Exemple — Paul Ndom", type: "Particulier", telephone: "+237 6 80 00 00 33", email: "paul.exemple@cofis.cm", ville: "Bafoussam", statut: "Inactif" }
];

function estLocataire(valeur: unknown): valeur is Locataire {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;

  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.nom === "string" &&
    (element.type === "Particulier" || element.type === "Entreprise") &&
    typeof element.telephone === "string" &&
    typeof element.email === "string" &&
    typeof element.ville === "string" &&
    (element.statut === "Prospect" || element.statut === "Actif" || element.statut === "Inactif");
}

function validerListeLocataires(valeur: unknown): valeur is Locataire[] {
  return Array.isArray(valeur) && valeur.every(estLocataire);
}

/** Dépôt local de démonstration ; conserve la clé historique des locataires. */
export const depotLocatairesDemo = creerDepotDemo<Locataire>({
  cle: "cofis_demo_locataires_v1",
  valeursInitiales: locatairesInitiaux,
  validerCollection: validerListeLocataires
});
