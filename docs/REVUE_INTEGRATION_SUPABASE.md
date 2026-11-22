# Revue de préparation Supabase — COFIS IMMOBILIER

Date : 18 novembre 2026  
Branche : `development`  
Statut : préparation du code uniquement — aucune connexion active.

## 1. Ce qui a été ajouté

- Client Supabase navigateur fondé sur `@supabase/ssr`.
- Client Supabase serveur utilisant les cookies Next.js.
- Validation Zod des deux variables publiques obligatoires.
- Erreur explicite si une seule des deux variables est renseignée.
- Import `server-only` pour empêcher l'utilisation du client serveur dans le bundle navigateur.
- Aucun client utilisant `service_role` n'est fourni.

Ces clients sont des points d'entrée techniques. Ils ne sont pas encore appelés par les pages de démonstration.

## 2. Variables d'environnement

À configurer uniquement après approbation explicite de l'environnement :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

La clé publique/anon n'est pas une autorisation d'accès aux données : la sécurité doit être imposée par les politiques RLS et les fonctions autorisées côté base.

`SUPABASE_SERVICE_ROLE_KEY` reste strictement serveur et ne doit jamais être préfixée par `NEXT_PUBLIC_`, importée dans un module client ou transmise au navigateur. Le présent lot ne l'utilise pas.

Ne pas placer de vraies clés dans Git, dans `.env.example`, dans les captures d'écran ou dans les messages de diagnostic. Utiliser un fichier local ignoré par Git, tel que `.env.local`.

## 3. Architecture cible déjà définie

- Supabase Auth fournit l'identité.
- `app.principals.auth_user_id` relie l'identité Auth au principal métier.
- Les données métier résident dans le schéma `app`.
- Seul le schéma `api` est exposé via PostgREST.
- Les écritures sensibles, particulièrement financières, passent par des RPC contrôlées.
- Les vues de lecture suivent le modèle de sécurité validé.
- Les contrôles RLS et les permissions applicatives sont cumulatifs ; masquer un bouton dans l'interface ne constitue pas un contrôle d'accès.

## 4. Ce qui reste volontairement désactivé

- Aucune création ou connexion à un projet Supabase.
- Aucune authentification réelle ou création d'utilisateur.
- Aucun middleware/Proxy de protection des routes activé.
- Aucun accès aux tables métier.
- Aucune migration, réparation ou écriture SQL.
- Aucun bucket de stockage créé ou configuré.
- Aucun déploiement.

La protection des routes ne doit pas être activée isolément avant d'avoir défini et vérifié le lien entre l'utilisateur Auth, `app.principals`, les rôles et les périmètres de propriétés. Sinon, l'interface pourrait confondre une session Auth valide avec un utilisateur métier autorisé.

## 5. Conditions avant activation

1. Approbation explicite du projet Supabase et de l'environnement cible.
2. Revue de la version finale du schéma et des migrations par l'architecte.
3. Décisions métier ouvertes documentées et approuvées.
4. Vérification des politiques RLS, fonctions RPC, privilèges et tests avec de vrais JWT de rôles différents.
5. Définition du cycle de session, de la protection des routes et de la procédure de désactivation des comptes.
6. Tests de sécurité et de non-régression avant toute bascule des données de démonstration.

## 6. État de validation

Le code a été préparé et commité sur `development`. Les commandes locales `npm install`, `npm run typecheck`, `npm run lint` et `npm run build` doivent être exécutées dans le dépôt local après récupération des changements. Aucune réussite de ces contrôles n'est présumée dans cette revue.
