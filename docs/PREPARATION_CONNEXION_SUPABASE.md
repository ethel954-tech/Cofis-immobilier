# Préparation de la connexion Supabase — COFIS IMMOBILIER

Statut : guide de préparation uniquement. Aucune connexion ni modification de base n'est autorisée par ce document.

## Informations nécessaires au branchement initial

Lorsque le projet Supabase sera prêt et explicitement approuvé pour le développement, la configuration locale nécessitera :

- URL du projet Supabase.
- Clé publique publishable/anon du projet.

Ces deux valeurs seront placées uniquement dans le fichier local `.env.local`, jamais dans Git. Le fichier `.env.example` reste un modèle sans valeur secrète.

## Informations à ne pas transmettre

- Ne pas envoyer la clé `service_role` ou une clé secrète Supabase dans le chat.
- Ne pas envoyer de mot de passe de compte, de jeton personnel ou de clé de récupération.
- Ne jamais placer une clé secrète dans une variable `NEXT_PUBLIC_*`.

Le navigateur ne doit utiliser que la clé publique. Les politiques RLS restent indispensables ; la clé publique seule ne remplace pas les autorisations de la base.

## Séquence de raccordement prévue

1. Confirmer le projet et l'environnement (développement, préproduction ou production).
2. Recevoir uniquement l'URL du projet et la clé publique.
3. Configurer `.env.local` sur le poste de développement, sans commiter le fichier.
4. Vérifier la configuration des clients Supabase déjà préparés.
5. Tester d'abord la connexion et l'état Auth sans écrire dans les tables métier.
6. Faire une revue en lecture seule du schéma réellement présent, des politiques RLS, des fonctions RPC et des privilèges.
7. Comparer le schéma réel avec les migrations et décisions métier approuvées.
8. Ne proposer aucune migration, réparation, écriture SQL ou déploiement sans autorisation explicite distincte.

## Limite actuelle

La démonstration COFIS reste utilisable sans Supabase. Les pages actuelles utilisent des données fictives stockées dans le navigateur. Le raccordement Supabase ne doit pas être présenté comme actif tant que l'authentification, les autorisations et la persistance n'ont pas été intégrées et testées.
