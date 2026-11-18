# Modèle d'identité et d'autorisations — proposition de revue

Date : 19 novembre 2026  
Statut : proposition technique, non activée et non approuvée pour la production.

## 1. Profils de la Phase 1

La note de cadrage distingue quatre profils internes :

| Profil | Responsabilités indiquées dans la note source |
|---|---|
| Administrateur | Paramètres, comptes, rôles, configuration générale et accès complet autorisé |
| Gestionnaire immobilier | Gestion opérationnelle des biens, logements, locataires, baux, relances et maintenance |
| Comptable / finance | Paiements, dépenses, rapprochements, états financiers et reversements |
| Direction COFIS | Vue consolidée, tableaux de bord, validations et rapports de pilotage |

Les profils Propriétaire et Locataire sont prévus pour les portails de Phase 2. Ils ne sont pas ajoutés aux rôles internes de Phase 1 dans ce lot.

## 2. Matrice fonctionnelle de haut niveau (à valider)

| Domaine | Administrateur | Gestionnaire immobilier | Comptable / finance | Direction |
|---|---|---|---|---|
| Comptes, rôles, paramètres | Gestion | Non défini dans la source | Non défini dans la source | Pilotage / validation à préciser |
| Propriétaires, immeubles, unités | Accès complet autorisé | Gestion opérationnelle | Consultation nécessaire à préciser | Vue consolidée |
| Locataires et baux | Accès complet autorisé | Gestion opérationnelle | Consultation nécessaire à préciser | Vue consolidée |
| Échéances, paiements, impayés | Accès complet autorisé | Relances ; saisie financière à préciser | Gestion financière à préciser | Indicateurs consolidés |
| Dépenses et rapprochements | Accès complet autorisé | Maintenance / opérationnel ; saisie à préciser | Gestion financière | Vue consolidée |
| Reversements | Accès complet autorisé | Non défini dans la source | Gestion financière ; préparation/exécution à préciser | Validation à préciser |
| Rapports et tableaux de bord | Accès complet autorisé | Selon périmètre à préciser | États financiers | Pilotage consolidé |

**Important :** cette matrice traduit uniquement les responsabilités de haut niveau décrites dans la note de cadrage. Elle ne constitue pas une attribution définitive de droits CRUD, de seuils d'approbation ou de séparation des tâches. Les cellules « à préciser » ne doivent pas être converties en autorisations implicites.

## 3. Principes techniques proposés

1. Supabase Auth authentifie l'utilisateur et fournit son identifiant Auth.
2. Le registre métier `app.principals` associe cet identifiant via `auth_user_id`.
3. Le rôle métier et les permissions sont résolus depuis une source serveur de confiance.
4. Le périmètre de données (par exemple les propriétés auxquelles un gestionnaire est affecté) est contrôlé côté serveur et en base, pas à partir d'un filtre d'interface.
5. Les politiques RLS constituent une défense obligatoire au niveau des données ; masquer un lien ou un bouton ne protège pas une ressource.
6. Les opérations sensibles produisent une trace d'audit et les données contractuelles/financières conservent l'historique conformément aux règles validées.
7. Le navigateur ne reçoit jamais de clé `service_role`. Les écritures financières sont réservées aux fonctions/RPC explicitement autorisées dans l'architecture de base approuvée.

## 4. Cycle d'une requête authentifiée (cible)

```text
Navigateur
  → session Supabase Auth
  → Next.js (cookies de session)
  → résolution serveur du principal métier
  → résolution rôle + permissions + périmètre
  → accès au schéma API exposé
  → RLS + privilèges + RPC contrôlée
  → réponse limitée aux données autorisées
```

Un utilisateur Auth valide n'est pas automatiquement autorisé à accéder à l'application métier : le lien avec le principal COFIS, l'état du compte, le rôle et le périmètre doivent tous être vérifiés.

## 5. Décisions à faire valider avant le code d'autorisation

- Qui crée, invite, désactive et réactive les comptes internes ?
- Un utilisateur peut-il cumuler plusieurs rôles ?
- Le rôle est-il global ou peut-il varier par propriété / portefeuille ?
- Comment les gestionnaires sont-ils affectés aux propriétés et qui valide ces affectations ?
- Quels droits exacts de lecture, création, modification, suppression et export par domaine ?
- Qui saisit, vérifie, approuve et exécute les paiements, dépenses et reversements ?
- La séparation entre préparation et validation est-elle obligatoire pour certains montants ?
- Quelles actions nécessitent une réauthentification ou une confirmation renforcée ?
- Quelle est la politique de désactivation, de révocation des sessions et de conservation de l'audit ?

## 6. Hors périmètre de ce lot

- Aucune session utilisateur réelle.
- Aucune création d'utilisateur Auth.
- Aucune protection de route activée.
- Aucun rôle attribué à un compte réel.
- Aucune policy RLS, RPC ou migration créée/modifiée.
- Aucune connexion à un projet Supabase.

## 7. Conditions d'activation

Le modèle doit être confronté à la version finale approuvée du schéma Supabase et à l'avis de l'architecte. La revue Stage 3 et les décisions métier encore ouvertes ne sont pas réputées approuvées par ce document. L'activation exige une approbation explicite de l'environnement et des règles d'accès par le propriétaire du projet.
