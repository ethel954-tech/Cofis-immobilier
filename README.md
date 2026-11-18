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
- Rapports synthétiques et export CSV du résumé.

Les modules de démonstration utilisent le stockage local du navigateur. Les données d'exemple sont fictives, ne sont pas partagées entre utilisateurs et ne constituent pas des données métier persistantes. Ne pas y saisir de données personnelles, pièces d'identité ou contrats réels.

## Technologie prévue

- Next.js et TypeScript.
- PostgreSQL via Supabase.
- Supabase Auth et stockage privé.
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

## Prochaines étapes

1. Revue locale du lot actuel : typecheck, lint, build et parcours fonctionnels.
2. Validation des règles métier des baux et de l'occupation.
3. Conception contrôlée des échéances, paiements, impayés, dépenses et reversements.
4. Mise en place de l'authentification et de la persistance serveur après approbation explicite de l'environnement et du schéma.
