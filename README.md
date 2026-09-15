# Culture Quiz

Projet Ynov : une API Laravel (`back/`) + une base MySQL, lancées avec Docker, et un front React (`frontend/`).

**Seul prérequis pour le back : [Docker Desktop](https://www.docker.com/products/docker-desktop/).** Pas besoin d'installer PHP, Composer ou MySQL.

## Première fois (après avoir cloné le projet)

1. **Lance Docker Desktop** et attends qu'il indique qu'il tourne.

2. **Ouvre un terminal à la racine du projet** (le dossier qui contient `docker-compose.yml`) :

   ```bash
   docker compose up -d --build
   ```

3. **Attends que tout soit prêt.** La première fois, ça peut prendre **5 à 10 minutes** : Docker télécharge MySQL et PHP, puis installe les dépendances Laravel (`composer install`).

   ```bash
   docker compose ps
   ```

   `db` doit afficher `healthy`. Pour suivre l'API :

   ```bash
   docker compose logs -f api
   ```

   C'est prêt quand tu vois `Development Server (http://0.0.0.0:8000) started` (`Ctrl+C` pour quitter les logs).

4. **Crée les tables et les questions** (une seule fois) :

   ```bash
   docker compose exec api php artisan migrate:fresh --seed
   ```

5. **Teste** dans le navigateur : <http://localhost:8000/api/categories>
   Si tu vois les 5 catégories, ça marche.

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

## En cas de problème

| Problème | Solution |
|---|---|
| `Cannot connect to the Docker daemon` / `failed to connect to the docker API` | Docker Desktop n'est pas lancé |
| `port 8000 is already allocated` | Un autre programme utilise le port 8000 : ferme-le |
| `port 3307 is already allocated` | Rare : change `3307` dans `docker-compose.yml` |
| `migrate` échoue avec `Connection refused` | MySQL n'est pas encore prêt : attends 20 s et relance |
| La page ne s'affiche pas sur le port 8000 | L'API démarre encore, ou regarde l'erreur avec `docker compose logs api` |

Plus de détails (endpoints, format JSON, ajout de questions, export de la base) : [back/README.md](back/README.md).
