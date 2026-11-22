# COFIS IMMOBILIER

Plateforme de gestion immobilière et locative destinée au marché camerounais (FCFA / XAF).

## État actuel

Le développement fonctionnel se poursuit sur la branche `development`. La branche `main` reste réservée aux versions relues et stabilisées.

### Accès à la démonstration

Depuis l'écran de connexion, utiliser **Accéder à la démonstration**. Le parcours initialise des exemples fictifs uniquement dans le navigateur et ouvre le tableau de bord ; il ne crée pas de session utilisateur. Voir `docs/GUIDE_PRESENTATION_CLIENT.md` pour le parcours de présentation et les limites à annoncer.

### Modules disponibles en démonstration

- Tableau de bord interne.
- Répertoire des propriétaires.
- Gestion des immeubles et rattachement aux propriétaires.
- Gestion des unités / logements et rattachement aux immeubles.
- Répertoire des locataires.
- Registre des baux et rattachement locataire–unité.
- Registre de démonstration des paiements (recherche, filtre par période, total de la sélection et export CSV filtré, sans affectation aux échéances).
- Registre de démonstration des dépenses (recherche, filtre par période, total de la sélection et export CSV filtré, sans validation comptable).
- Aperçu complémentaire du suivi de maintenance (signalements fictifs, priorité, statut et recherche).
- Rapports synthétiques et export CSV du résumé.

Les modules de démonstration utilisent le stockage local du navigateur, y compris les registres financiers expérimentaux et l'aperçu maintenance. Ce dernier n'envoie aucune notification et ne planifie pas de prestataire. Les exports CSV des registres financiers reprennent les résultats filtrés et protègent les cellules contre l’exécution de formules dans les tableurs. Un utilitaire partagé assure également l'export des propriétaires et des rapports. Les données d'exemple sont fictives, ne sont pas partagées entre utilisateurs et ne constituent pas des données métier persistantes. Ne pas y saisir de données personnelles, pièces d'identité ou contrats réels.

## Technologie prévue

- Next.js et TypeScript.
- PostgreSQL via Supabase.
- Supabase Auth et stockage privé (intégration préparée, non activée).
- Interface responsive avec Tailwind CSS et Lucide.

## Démarrage local

Prérequis : Node.js et npm.

```powershell
git switch development
git pull origin development
npm install
npm run dev
```

Ouvrir ensuite http://localhost:3000.

Vérifications disponibles :

```powershell
npm run typecheck
npm run lint
npm run build
```

Exécuter ces commandes depuis le dossier du projet. Un résultat local doit être vérifié avant de considérer le lot comme validé.

## Principes de sécurité et de livraison

- Aucun projet Supabase partagé ou de production ne doit être créé, connecté ou modifié sans autorisation explicite.
- Aucune migration ne doit être appliquée à une base partagée ou de production sans autorisation explicite.
- Les opérations financières réelles doivent être traçables et mises en œuvre selon l'architecture approuvée, avec des montants entiers en FCFA/XAF.
- Les règles métier encore ouvertes doivent être validées avant d'être codées comme règles définitives.
- Les clés de service Supabase ne doivent jamais être exposées au navigateur.
- `main` ne reçoit que des versions relues et stabilisées.

## Intégration Supabase — état

Les clients navigateur et serveur, ainsi que la validation des variables publiques, sont préparés dans `src/lib/supabase/`. Ils ne sont pas encore utilisés par les pages : aucune connexion Supabase n'est effectuée et le mode démonstration local reste inchangé. Voir `docs/REVUE_INTEGRATION_SUPABASE.md`, `docs/PREPARATION_CONNEXION_SUPABASE.md` et la proposition de rôles dans `docs/MODELE_AUTORISATION_PROPOSE.md`.

## Prochaines étapes

1. Revue locale du lot : installation des dépendances, typecheck, lint et build.
2. Revue de sécurité de l'intégration et validation des règles métier encore ouvertes.
3. Approbation explicite de l'environnement Supabase et du schéma final.
4. Activation contrôlée de l'authentification et de la persistance serveur, après tests RLS/RPC.


## Paramètres de l'agence — aperçu

Le module `/parametres` permet de saisir localement les coordonnées de démonstration de l'agence et de consulter une matrice indicative des rôles (administrateur, gestionnaire immobilier, comptable/finance et direction). Ces paramètres restent dans le navigateur. La matrice n'applique aucune permission réelle : l'authentification, les contrôles d'accès serveur et les politiques de base de données restent à intégrer et valider.
