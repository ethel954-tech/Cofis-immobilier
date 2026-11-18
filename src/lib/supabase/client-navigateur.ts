import { createBrowserClient } from "@supabase/ssr";
import { obtenirConfigurationSupabase } from "./configuration";

/**
 * Client navigateur basé uniquement sur la clé publique/anon.
 * Ne jamais y importer ni y transmettre une clé service_role.
 */
export function creerClientNavigateur() {
  const configuration = obtenirConfigurationSupabase();

  if (!configuration) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez les deux variables publiques dans .env.local."
    );
  }

  return createBrowserClient(
    configuration.url,
    configuration.cleAnonyme
  );
}
