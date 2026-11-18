# État du développement — COFIS IMMOBILIER

Dernière mise à jour : 18 novembre 2026

## Branche de travail

- Développement : `development`
- Branche stable : `main`
- Aucun déploiement effectué.
- Aucun projet Supabase partagé connecté ou modifié.
- Aucune migration appliquée à une base partagée.

## Modules de démonstration présents

| Module | Fonctionnalités |
|---|---|
| Tableau de bord | Espace interne d'administration |
| Propriétaires | Répertoire, recherche, création et édition, stockage local |
| Immeubles | Répertoire, rattachement à un propriétaire, création et édition |
| Unités / logements | Répertoire, rattachement à un immeuble, recherche, filtres, création, édition et suppression |
| Locataires | Répertoire des particuliers et entreprises, recherche, filtres, création, édition et suppression |
| Baux | Liaison locataire–unité, dates, loyer saisi, dépôt saisi, statut déclaratif, notes, recherche et filtres |
| Rapports | Indicateurs de structure et export CSV de synthèse |

## Limites connues

- Les données de démonstration sont conservées dans le stockage local du navigateur.
- Les données ne sont pas synchronisées, sauvegardées côté serveur ou partagées entre utilisateurs.
- Les fiches de démonstration ne doivent pas contenir de données personnelles ou contractuelles réelles.
- Les valeurs de loyer et de dépôt affichées dans les modules ne sont pas des écritures comptables, encaissements ou soldes.
- Les rapports ne sont pas des rapports comptables ou financiers officiels.
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
