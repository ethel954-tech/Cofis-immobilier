# Bibliothèque applicative

Les utilitaires partagés sont organisés ici :

- `supabase/configuration.ts` : validation des variables publiques, sans chargement de secret serveur.
- `supabase/client-navigateur.ts` : client navigateur basé sur la clé publique/anon.
- `supabase/client-serveur.ts` : client serveur basé sur les cookies Next.js et protégé par `server-only`.
- `autorisations.ts` : contrôle des rôles et périmètres d'accès (à compléter côté serveur).
- `validations/` : schémas Zod et règles de validation.
- `formatage/` : formatage des montants FCFA, dates et libellés.

Les clients Supabase sont des points d'entrée préparatoires et ne sont pas encore appelés par les pages. Aucun client `service_role` n'est fourni. Toute écriture métier sensible devra passer par les RPC autorisées, avec RLS en défense complémentaire.
