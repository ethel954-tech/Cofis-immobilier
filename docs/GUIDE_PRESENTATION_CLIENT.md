# Guide de présentation client — COFIS IMMOBILIER

## Accès au prototype

1. Ouvrir l'adresse de démonstration fournie par l'équipe COFIS.
2. Sur l'écran d'accueil, cliquer sur **Accéder à la démonstration**.
3. Le prototype prépare automatiquement des exemples fictifs dans le navigateur puis ouvre le tableau de bord.
4. Naviguer entre les modules avec le menu latéral sur ordinateur ou le menu supérieur sur mobile.

Le prototype ne demande aucun identifiant. Ce parcours est volontairement distinct d'une authentification réelle.

## Parcours conseillé (5 à 8 minutes)

1. **Tableau de bord** — présenter les volumes de propriétaires, immeubles, unités et locataires.
2. **Propriétaires** — consulter les fiches et montrer la recherche et l'export CSV.
3. **Immeubles** — montrer le rattachement d'un immeuble à un propriétaire.
4. **Unités / logements** — montrer les références, types, loyers saisis et statuts déclarés.
5. **Locataires** — consulter les fiches de particuliers et d'entreprises.
6. **Baux** — montrer le rattachement entre locataire et unité, les dates, le loyer et le statut saisi.
7. **Paiements et dépenses** — montrer les registres, la recherche, les filtres de dates et l'export CSV.
8. **Maintenance** — montrer le signalement d'une intervention, sa priorité et le suivi par statut.\n9. **Rapports** — terminer par la synthèse des données de démonstration.

## Ce que le prototype permet de montrer

- Une interface de gestion immobilière responsive.
- Les principaux répertoires et relations entre propriétaires, immeubles, unités, locataires et baux.
- La saisie locale de fiches et de registres de démonstration.
- La recherche, certains filtres et les exports CSV.\n- Un aperçu complémentaire du suivi des signalements de maintenance.
- Une première organisation des espaces patrimoine, location, finance et pilotage.

## Limites à annoncer clairement

- Toutes les données sont fictives et conservées dans le stockage local du navigateur utilisé.
- Les données ne sont ni partagées entre utilisateurs, ni synchronisées sur un serveur.
- L'authentification, les rôles réels et les autorisations ne sont pas activés.
- Les paiements et dépenses sont des registres expérimentaux : aucune échéance n'est générée, aucun paiement n'est affecté automatiquement, et aucun solde, impayé, rapprochement ou reversement n'est calculé.\n- Le registre maintenance est un aperçu local : les statuts d'exemple ne déclenchent pas d'intervention réelle, aucune notification n'est envoyée et aucun prestataire n'est planifié.
- Les exports sont des exports de démonstration et non des documents comptables officiels.
- Les modules indiqués « Bientôt » ne sont pas encore implémentés.

## À ne pas faire pendant la démonstration

- Ne saisir aucune donnée réelle de propriétaire, locataire, bail, pièce d'identité ou paiement.
- Ne présenter aucun montant comme un encaissement rapproché, un solde ou un revenu net.
- Ne promettre aucune intégration bancaire, Mobile Money, SMS, WhatsApp ou portail client comme déjà opérationnelle.
- Ne pas utiliser le prototype comme environnement de production.

## Préparation technique avant envoi

Depuis le dépôt local, sur la branche `development` :

```powershell
git switch development
git pull origin development
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Ouvrir ensuite `http://localhost:3000` et tester le bouton **Accéder à la démonstration**.

Un partage à distance nécessite un hébergement et une validation explicite du propriétaire du projet. Aucun déploiement ni environnement Supabase n'est inclus dans ce prototype.
