# Culture Quiz

Projet Ynov : une API FastAPI (`api/`) + une base MySQL, lancées avec Docker, et un front React (`frontend/`).

**Seul prérequis pour le back : [Docker Desktop](https://www.docker.com/products/docker-desktop/).** Pas besoin d'installer Python ou MySQL.

## Première fois (après avoir cloné le projet)

1. **Lance Docker Desktop** et attends qu'il indique qu'il tourne.

2. **Ouvre un terminal à la racine du projet** (le dossier qui contient `docker-compose.yml`) :

   ```bash
   docker compose up -d --build
   ```

3. **Attends que tout soit prêt.** La première fois, compte **2 à 3 minutes** : Docker télécharge MySQL et Python, puis installe les dépendances.

   ```bash
   docker compose logs -f api
   ```

   C'est prêt quand tu vois `Base initialisée : 60 questions insérées.` puis `Application startup complete.` (`Ctrl+C` pour quitter les logs).

4. **Teste** dans le navigateur : <http://localhost:8000/api/categories>
   Si tu vois les 5 catégories, ça marche.

> **Pas de migration ni de seed à lancer à la main** : l'API crée les tables et insère les questions toute seule au démarrage.

## Les autres jours

```bash
docker compose up -d     # démarrer (attendre ~30 s que l'API réponde)
docker compose down      # arrêter
```

Les données sont conservées, pas besoin de relancer le seed.

## Le front

Dans un autre terminal (le back doit tourner en même temps) :

```bash
cd frontend
npm install     # la première fois seulement
npm run dev
```

Puis ouvre <http://localhost:5173>.

## Les endpoints

| Route | Ce qu'elle renvoie |
|---|---|
| `GET /api/categories` | les 5 catégories |
| `GET /api/categories/{id}/questions` | 10 questions au hasard, 4 réponses mélangées chacune |
| `GET /api/health` | `{"status": "ok"}` |

Doc interactive (testable dans le navigateur) : <http://localhost:8000/docs>

## En cas de problème

| Problème | Solution |
|---|---|
| `failed to connect to the docker API` | Docker Desktop n'est pas lancé |
| `Access denied for user 'quizz'` | Vieille base de la version Laravel : `docker compose down -v` puis `up -d` |
| `/api/categories` renvoie `[]` | Base créée mais pas remplie : `docker compose down -v` puis `up -d` |
| L'API répète `MySQL pas encore prêt...` | Normal ~30 s. Si ça dure : `docker compose logs db` |
| Erreur CORS dans le front | Ajoute l'origine dans `CORS_ALLOWED_ORIGINS` (`docker-compose.yml`) |
| `port 8000 is already allocated` | Un autre programme utilise le port : ferme-le |
| `port 3307 is already allocated` | Rare : change `3307` dans `docker-compose.yml` |

> ⚠️ **Tu avais déjà lancé l'ancienne version Laravel ?** Le schéma et les identifiants MySQL ont changé : fais un `docker compose down -v` avant le premier démarrage.

Plus de détails (format JSON, ajout de questions, fonctionnement interne) : [api/README.md](api/README.md).
