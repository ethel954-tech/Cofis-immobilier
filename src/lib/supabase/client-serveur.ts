import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { obtenirConfigurationSupabase } from "./configuration";

/**
 * Client serveur utilisant les cookies de session de l'utilisateur.
 * À appeler depuis un Server Component, une Server Action ou une Route Handler.
 * Les écritures métier sensibles devront passer par les RPC autorisées du schéma api.
 */
export async function creerClientServeur() {
  const configuration = obtenirConfigurationSupabase();

  if (!configuration) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez les deux variables publiques dans .env.local."
    );
  }

  const magasinCookies = await cookies();

  return createServerClient(
    configuration.url,
    configuration.cleAnonyme,
    {
      cookies: {
        getAll() {
          return magasinCookies.getAll();
        },
        setAll(cookiesAActualiser) {
          try {
            cookiesAActualiser.forEach(({ name, value, options }) => {
              magasinCookies.set(name, value, options);
            });
          } catch {
            // Un Server Component ne peut pas toujours modifier les cookies.
            // Les mises à jour de session devront être prises en charge par
            // la couche Proxy/Route Handler avant d'activer l'authentification.
          }
        }
      }
    }
  );
}
