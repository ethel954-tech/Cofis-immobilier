import { creerDepotValeurDemo } from "@/lib/donnees/depot";

export interface ParametresAgence {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  devise: "XAF";
}

export const parametresAgenceInitiaux: ParametresAgence = {
  nom: "COFIS IMMOBILIER",
  telephone: "",
  email: "",
  adresse: "",
  ville: "Yaoundé",
  devise: "XAF"
};

function estParametresAgence(valeur: unknown): valeur is ParametresAgence {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return typeof element.nom === "string" &&
    typeof element.telephone === "string" &&
    typeof element.email === "string" &&
    typeof element.adresse === "string" &&
    typeof element.ville === "string" &&
    element.devise === "XAF";
}

/** Dépôt de démonstration conservant la clé et le format objet historiques. */
export const depotParametresAgenceDemo = creerDepotValeurDemo<ParametresAgence>({
  cle: "cofis_demo_parametres_agence_v1",
  valeurInitiale: parametresAgenceInitiaux,
  valider: estParametresAgence
});
