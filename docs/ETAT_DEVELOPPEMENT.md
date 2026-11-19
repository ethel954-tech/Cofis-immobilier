# État du développement — COFIS IMMOBILIER

Dernière mise à jour : 19 novembre 2026

## Branche de travail

- Développement : `development`
- Branche stable : `main`
- Aucun déploiement effectué.
- Aucun projet Supabase partagé connecté ou modifié.
- Aucune migration appliquée à une base partagée.
- Clients Supabase navigateur/serveur préparés sur `development`, mais non appelés par les pages.
- Aucune session Auth réelle ni protection de routes activée.
- Modèle d'identité et matrice de rôles proposés dans `docs/MODELE_AUTORISATION_PROPOSE.md` ; droits détaillés non approuvés.

## Navigation adaptative

- La navigation mobile est disponible depuis l'en-tête sur les petits écrans ; les liens actifs sont signalés et le menu se referme après sélection.
- La navigation latérale de bureau reste inchangée.
- Les modules non implémentés restent explicitement indiqués comme à venir ; aucune fonctionnalité métier n'est simulée comme active.

## Modules de démonstration présents

| Module | Fonctionnalités |
|---|---|
| Tableau de bord | Compteurs issus des données locales des modules, suivi des dossiers et raccourcis ; aucune métrique financière simulée |
| Propriétaires | Répertoire, recherche, création et édition, export CSV de la liste filtrée, stockage local |
| Immeubles | Répertoire, rattachement à un propriétaire, création et édition |
| Unités / logements | Répertoire, rattachement à un immeuble, recherche, filtres, création, édition et suppression |
| Locataires | Répertoire des particuliers et entreprises, recherche, filtres, création, édition et suppression |
| Baux | Liaison locataire–unité, dates, loyer saisi, dépôt saisi, statut déclaratif, notes, recherche et filtres |
| Paiements | Registre local append-only, référence unique, rattachement à un bail, date, montant entier FCFA, mode et référence externe ; recherche, filtre par période et export CSV filtré ; aucune affectation automatique |
| Dépenses | Registre local append-only, référence unique, date, catégorie, description, fournisseur, montant entier FCFA, référence de justificatif, recherche, filtre par période et export CSV filtré |
| Rapports | Indicateurs de structure et export CSV de synthèse |

## Limites connues

- Les données de démonstration sont conservées dans le stockage local du navigateur.
- Les données ne sont pas synchronisées, sauvegardées côté serveur ou partagées entre utilisateurs.
- Les fiches de démonstration ne doivent pas contenir de données personnelles ou contractuelles réelles.
- Les valeurs de loyer et de dépôt affichées dans les modules ne sont pas des écritures comptables, encaissements ou soldes.
- Les rapports ne sont pas des rapports comptables ou financiers officiels.
- Les registres de paiements et dépenses sont des prototypes locaux append-only ; ils ne sont ni partagés ni persistants côté serveur.\n- Les exports CSV des registres financiers ne contiennent que les lignes actuellement filtrées ; ils utilisent un séparateur point-virgule, un BOM UTF-8 et une protection contre les formules de tableur. Ils restent des exports de démonstration, pas des pièces comptables.
- Les paiements ne sont pas affectés aux échéances ; aucun solde ou impayé n’est calculé.
- Les dépenses ne sont pas approuvées, payées ou imputées à un bien ; elles ne sont pas déduites d’un reversement.
- Le tableau de bord lit les listes enregistrées localement ; il ne synchronise pas automatiquement les changements effectués dans un autre onglet déjà ouvert.
- Les indicateurs financiers restent masqués tant que les règles métier et les modules de paiement ne sont pas validés.
- Les statuts de bail et d'unité sont déclaratifs. Ils ne sont pas automatiquement recalculés selon les dates ou les contrats.

## Règles métier à ne pas présumer

Les éléments suivants restent à confirmer avant toute automatisation ou migration :

- Définition officielle d'une unité occupée et source de vérité de l'occupation.
- Cycle de vie complet d'un bail et conditions de transition entre statuts.
- Autorisation ou non de baux historiques et chevauchement de périodes.
- Règle d'unicité éventuelle d'un bail actif par unité.
- Génération des échéances : périodicité, date d'exigibilité, prorata et ajustements.
- Paiements partiels, paiements non affectés, trop-perçus, annulations et remboursements.
- Formule de calcul des reversements propriétaires, retenues et commissions.
- Rôle de COFIS dans la détention et le transfert des fonds encaissés.

## Intégration Supabase préparée

- `src/lib/supabase/configuration.ts` valide les variables publiques et refuse une configuration partielle.
- `src/lib/supabase/client-navigateur.ts` utilise uniquement la clé publique/anon.
- `src/lib/supabase/client-serveur.ts` est protégé par `server-only` et utilise les cookies Next.js.
- Aucun client `service_role` n'est fourni et aucune page n'appelle ces clients.
- La revue de sécurité et les conditions d'activation sont détaillées dans `docs/REVUE_INTEGRATION_SUPABASE.md`.

## Modèle d'identité et d'autorisations

Une proposition de rattachement Auth → `app.principals` et une matrice fonctionnelle de haut niveau ont été documentées. Les droits détaillés, les périmètres de propriétés et les règles de séparation des tâches restent à valider. Aucun contrôle d'accès réel n'a été activé.

## Prochain lot technique

La revue locale du lot doit être effectuée depuis le dépôt local avec :

```powershell
npm run typecheck
npm run lint
npm run build
```

Les résultats doivent être examinés avant de considérer le lot comme validé. Ne pas utiliser de commandes Git destructives pour nettoyer les fichiers locaux non suivis.

## Garde-fous

Aucune création de projet Supabase, connexion à une base, migration, réparation de migration, écriture dans une base partagée ou déploiement sans autorisation explicite du propriétaire du projet.
