import { creerDepotDemo } from "@/lib/donnees/depot";

export const ROLES_EQUIPE_COFIS = [
  "Administrateur",
  "Gestionnaire immobilier",
  "Comptable",
  "Direction"
] as const;

export type RoleEquipeCofis = typeof ROLES_EQUIPE_COFIS[number];
export type StatutCompteEquipe = "Actif" | "Inactif";

export interface UtilisateurEquipe {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: RoleEquipeCofis;
  statut: StatutCompteEquipe;
  dateCreation: string;
}

function estUtilisateurEquipe(valeur: unknown): valeur is UtilisateurEquipe {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return false;
  const element = valeur as Record<string, unknown>;
  return Number.isSafeInteger(element.id) &&
    typeof element.nom === "string" &&
    typeof element.email === "string" &&
    typeof element.telephone === "string" &&
    ROLES_EQUIPE_COFIS.includes(element.role as RoleEquipeCofis) &&
    (element.statut === "Actif" || element.statut === "Inactif") &&
    typeof element.dateCreation === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(element.dateCreation);
}

function estCollectionUtilisateurs(valeur: unknown): valeur is UtilisateurEquipe[] {
  return Array.isArray(valeur) && valeur.every(estUtilisateurEquipe);
}

/** Répertoire de démonstration local : aucun compte d'authentification n'est créé. */
export const depotUtilisateursEquipeDemo = creerDepotDemo<UtilisateurEquipe>({
  cle: "cofis_demo_utilisateurs_equipe_v1",
  valeursInitiales: [],
  validerCollection: estCollectionUtilisateurs
});
