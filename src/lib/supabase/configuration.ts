import { z } from "zod";

const schemaEnvironnement = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    (valeur) => (valeur === "" ? undefined : valeur),
    z.string().url("NEXT_PUBLIC_SUPABASE_URL doit être une URL valide.").optional()
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    (valeur) => (valeur === "" ? undefined : valeur),
    z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY ne peut pas être vide.").optional()
  )
}).superRefine((valeurs, contexte) => {
  const urlPresente = Boolean(valeurs.NEXT_PUBLIC_SUPABASE_URL);
  const clePresente = Boolean(valeurs.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (urlPresente !== clePresente) {
    contexte.addIssue({
      code: "custom",
      message: "Les deux variables publiques Supabase doivent être définies ensemble."
    });
  }
});

export type ConfigurationSupabasePublique = {
  url: string;
  cleAnonyme: string;
};

/**
 * Retourne null tant que Supabase n'est pas configuré.
 * Une configuration partielle ou invalide provoque une erreur explicite.
 */
export function obtenirConfigurationSupabase(): ConfigurationSupabasePublique | null {
  const resultat = schemaEnvironnement.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  if (!resultat.success) {
    throw new Error(
      "Configuration Supabase invalide : " +
      resultat.error.issues.map((probleme) => probleme.message).join(" ")
    );
  }

  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = resultat.data;

  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    url: NEXT_PUBLIC_SUPABASE_URL,
    cleAnonyme: NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}
