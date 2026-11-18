export const ROLES = [
  "admin",
  "gestionnaire",
  "comptable",
  "direction"
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "tableau_de_bord.lire",
  "proprietaires.lire",
  "proprietaires.creer",
  "proprietaires.modifier",
  "immeubles.lire",
  "immeubles.creer",
  "immeubles.modifier",
  "unites.lire",
  "unites.creer",
  "unites.modifier",
  "locataires.lire",
  "locataires.creer",
  "locataires.modifier",
  "baux.lire",
  "baux.creer",
  "baux.modifier",
  "paiements.lire",
  "paiements.enregistrer",
  "paiements.reverser",
  "depenses.lire",
  "depenses.enregistrer",
  "reversements.lire",
  "reversements.valider",
  "rapports.lire",
  "utilisateurs.gerer",
  "parametres.gerer"
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export interface ProfilAuthentifie {
  id: string;
  nomAffiche: string;
  role: Role;
  permissions: readonly Permission[];
}
