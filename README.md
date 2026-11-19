# COFIS IMMOBILIER

Plateforme de gestion immobilière et locative destinée au marché camerounais (FCFA / XAF).

## État actuel

Le développement fonctionnel se poursuit sur la branche `development`. La branche `main` reste réservée aux versions relues et stabilisées.

### Modules disponibles en démonstration

- Tableau de bord interne.
- Répertoire des propriétaires.
- Gestion des immeubles et rattachement aux propriétaires.
- Gestion des unités / logements et rattachement aux immeubles.
- Répertoire des locataires.
- Registre des baux et rattachement locataire–unité.
- Registre de démonstration des paiements (recherche et export CSV filtré, sans affectation aux échéances).
- Registre de démonstration des dépenses (recherche et export CSV filtré, sans validation comptable).
- Rapports synthétiques et export CSV du résumé.

Les modules de démonstration utilisent le stockage local du navigateur, y compris les registres financiers expérimentaux. Les exports CSV des registres financiers reprennent les résultats filtrés et protègent les cellules contre l’exécution de formules dans les tableurs. Les données d'exemple sont fictives, ne sont pas partagées entre utilisateurs et ne constituent pas des données métier persistantes. Ne pas y saisir de données personnelles, pièces d'identité ou contrats réels.

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

Les clients navigateur et serveur, ainsi que la validation des variables publiques, sont préparés dans `src/lib/supabase/`. Ils ne sont pas encore utilisés par les pages : aucune connexion Supabase n'est effectuée et le mode démonstration local reste inchangé. Voir `docs/REVUE_INTEGRATION_SUPABASE.md` et la proposition de rôles dans `docs/MODELE_AUTORISATION_PROPOSE.md`.

## Prochaines étapes

1. Revue locale du lot : installation des dépendances, typecheck, lint et build.
2. Revue de sécurité de l'intégration et validation des règles métier encore ouvertes.
3. Approbation explicite de l'environnement Supabase et du schéma final.
4. Activation contrôlée de l'authentification et de la persistance serveur, après tests RLS/RPC.
