/**
 * Contrat commun des dépôts de données.
 * Les pages consomment ce contrat sans connaître le mode de stockage.
 */
export interface DepotCollection<T> {
  lister(): Promise<T[]>;
  enregistrer(elements: readonly T[]): Promise<void>;
}

interface OptionsDepotDemo<T> {
  cle: string;
  valeursInitiales: readonly T[];
  validerCollection(valeur: unknown): valeur is T[];
}

/**
 * Adaptateur de démonstration fondé sur localStorage.
 * Il ne contacte aucun service externe et ne modifie aucune base de données.
 */
export function creerDepotDemo<T>({
  cle,
  valeursInitiales,
  validerCollection
}: OptionsDepotDemo<T>): DepotCollection<T> {
  return {
    async lister(): Promise<T[]> {
      if (typeof window === "undefined") {
        return [...valeursInitiales];
      }

      try {
        const contenu = window.localStorage.getItem(cle);
        if (contenu === null) return [...valeursInitiales];

        const valeur: unknown = JSON.parse(contenu);
        return validerCollection(valeur) ? valeur : [...valeursInitiales];
      } catch {
        return [...valeursInitiales];
      }
    },

    async enregistrer(elements: readonly T[]): Promise<void> {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(cle, JSON.stringify(elements));
      } catch {
        throw new Error("Impossible d'enregistrer les données dans le stockage local.");
      }
    }
  };
}
