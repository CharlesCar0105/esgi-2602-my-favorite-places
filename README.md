## Prérequis

- Docker et Docker Compose
- Node.js 20 et npm (uniquement si vous souhaitez lancer des commandes en dehors des conteneurs)
- Git

## Structure du projet

```
.
├── client/                 Application front (Vite)
├── server/                 API Node.js / Express / TypeORM
├── docker-compose.yml      Environnement de développement
├── compose.prod.yml        Environnement de production (images GHCR)
└── .github/workflows/      Pipelines CI
```

## Lancer le projet en local

L'environnement de développement utilise `docker-compose.yml`. Il monte le code source en volume et lance le serveur avec `nodemon` pour que les modifications soient prises en compte automatiquement.

```bash
docker compose up --build
```

Le serveur est ensuite accessible sur `http://localhost:3000`.

Pour arrêter les conteneurs :

```bash
docker compose down
```

## Reproduire la production en local

Le fichier `compose.prod.yml` utilise les images publiées sur GitHub Container Registry (GHCR) plutôt qu'un build local. Il correspond à ce qui tournera en production.

```bash
docker compose -f compose.prod.yml up
```

Le client est alors servi sur `http://localhost:80` et le serveur sur `http://localhost:3000`.

Les images utilisées sont :

- `ghcr.io/charlescar0105/esgi-2602-my-favorite-places/server:latest`
- `ghcr.io/charlescar0105/esgi-2602-my-favorite-places/client:latest`

## Tests

Les tests du serveur utilisent Jest.

```bash
cd server
npm install
npm test
```

## Intégration continue

Deux workflows GitHub Actions sont configurés dans `.github/workflows/`.

### 1. `tests.yml` (Run Tests)

Déclencheur : push sur n'importe quelle branche, uniquement si des fichiers de `server/**` sont modifiés.

Actions :

- Installation des dépendances du serveur
- Exécution de `npm test`

Ce workflow est utilisé comme check obligatoire pour la protection de la branche `main` : une pull request ne peut pas être mergée si les tests échouent.

### 2. `docker.yml` (Build and Push Docker Images)

Déclencheur : push sur `main` ou `dev`.

Le workflow est découpé en plusieurs jobs afin d'éviter de reconstruire inutilement des images.

1. `versioning` : uniquement sur `main`. Crée automatiquement un nouveau tag Git (bump patch) à chaque push grâce à `mathieudutour/github-tag-action`.
2. `detect-changes` : détecte si les modifications concernent `server/`, `client/` ou les deux, via `dorny/paths-filter`. Les jobs suivants ne s'exécutent que pour les parties réellement modifiées.
3. `lint-server` et `lint-client` : vérification TypeScript (`tsc --noEmit`) sur la partie concernée.
4. `build-server` et `build-client` : build et push des images vers GHCR. Ces jobs ne s'exécutent que si le lint correspondant a réussi.

Tags appliqués aux images :

- Sur `main` : `latest`, le SHA court du commit, et le nouveau tag de version (ex. `v1.2.3`).
- Sur `dev` : `dev`.

## Effets de bord des workflows

- Création d'un tag Git et d'une release GitHub à chaque push sur `main`.
- Publication de nouvelles images sur GHCR (visibles dans l'onglet Packages du dépôt).
- Aucun déploiement automatique n'est configuré pour l'instant. La mise en production se fait en récupérant manuellement la dernière image sur le serveur cible.

## Environnements

| Environnement | Fichier Compose | Image utilisée | Usage |
|---------------|------------------|---------------------------|-------|
| Développement | `docker-compose.yml` | Build local + volume monté | Développement quotidien avec rechargement automatique |
| Production    | `compose.prod.yml`   | Image GHCR `latest`       | Simuler ou exécuter la version publiée |

La branche `dev` produit des images taguées `dev` utilisables pour une éventuelle recette avant merge sur `main`.

## Points d'attention pour les développeurs

- Toute modification du serveur déclenche les tests. Vérifier localement avec `npm test` avant de pousser.
- Un push sur `main` crée automatiquement un tag de version. Éviter les push directs, préférer les pull requests.
- Les variables sensibles (par exemple `SESSION_SECRET`) sont définies dans les fichiers Compose à des fins de démonstration. En production, elles doivent être fournies via un fichier `.env` ou les secrets de la plateforme d'hébergement.
- Les images sont publiques sur GHCR. Ne pas inclure de données sensibles dans le code ou les fichiers copiés dans l'image.
- Le dossier `server/node_modules` est ignoré par le volume de dev (`/app/node_modules` en volume anonyme) pour éviter les conflits entre le host et le conteneur.
