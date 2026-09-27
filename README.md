# Culture Quiz

Projet Ynov : une API FastAPI (`api/`) + une base MySQL lancées avec Docker, et un front React + TypeScript (`frontend/`) qui consomme cette API.

Le quiz porte sur cinq thèmes techniques — **Python**, **Réseau (CCNA)**, **Tailwind CSS**, **Cybersécurité** et **FastAPI** — à raison de 50 questions par thème, dont 10 tirées au hasard par partie.

```
cultureQuizz/
├── docker-compose.yml   # l'API et MySQL
├── api/                 # FastAPI : routes, modèles, seed des questions
└── frontend/            # React + Vite : accueil, choix du thème, écran de jeu
```

**Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/) pour le back, [Node 20+](https://nodejs.org/) pour le front.** Pas besoin d'installer Python ni MySQL.

## Lancer le projet

Il faut **deux terminaux** : le back tourne dans Docker, le front avec Vite.

### 1. Le back (terminal 1, à la racine du projet)

```bash
docker compose up -d --build
```

La première fois, compte **2 à 3 minutes** : Docker télécharge MySQL et Python, puis installe les dépendances. Pour suivre le démarrage :

```bash
docker compose logs -f api
```

C'est prêt quand tu vois `Base initialisée : 250 questions insérées.` puis `Application startup complete.` (`Ctrl+C` pour quitter les logs, l'API continue de tourner).

Vérifie dans le navigateur : <http://localhost:8000/api/categories> doit afficher les 5 catégories.

> **Pas de migration ni de seed à lancer à la main** : l'API crée les tables et insère les questions toute seule au démarrage.

### 2. Le front (terminal 2)

```bash
cd frontend
npm install     # la première fois seulement
npm run dev
```

Puis ouvre <http://localhost:5173>.

**Le back doit tourner en même temps** : le front n'a plus aucune question en dur, il lit tout depuis l'API. S'il affiche « API injoignable », c'est que l'étape 1 n'est pas faite.

### Les autres jours

```bash
docker compose up -d          # démarrer le back (~30 s avant que l'API réponde)
cd frontend && npm run dev    # démarrer le front
docker compose down           # arrêter le back en fin de séance
```

Les données MySQL sont conservées d'une session à l'autre.

## Comment le front parle à l'API

Tous les appels passent par `frontend/src/api.ts`, le seul fichier qui connaît l'URL du back :

| Écran | Route du front | Appel API |
|---|---|---|
| Accueil : la marque, bouton « Commencer » | `/` | aucun |
| Choix du thème | `/categories` | `GET /api/categories` |
| Partie : 10 questions chronométrées | `/jeu/:categorieId` | `GET /api/categories/{id}/questions` puis un `POST /api/answer` par réponse |
| Résultat : le score final | `/resultat` | aucun |

Par défaut le front vise `http://localhost:8000/api`. Pour viser ailleurs, crée un `frontend/.env` (voir `frontend/.env.example`) :

```
VITE_API_URL=http://192.168.1.20:8000/api
```

> Les réponses arrivent déjà mélangées par l'API, et leur `id` est un jeton signé : rien dans la charge utile ne dit laquelle est la bonne. La correction se fait par un `POST /api/answer` au moment où le joueur valide.

## Les endpoints

| Route | Ce qu'elle renvoie |
|---|---|
| `GET /api/categories` | les 5 catégories |
| `GET /api/categories/{id}/questions` | 10 questions au hasard, 4 réponses mélangées chacune — sans dire laquelle est la bonne |
| `POST /api/answer` | dit si la réponse envoyée est la bonne, et laquelle l'était |
| `GET /api/health` | `{"status": "ok"}` |

Doc interactive (testable dans le navigateur) : <http://localhost:8000/docs>

## En cas de problème

| Problème | Solution |
|---|---|
| `failed to connect to the docker API` | Docker Desktop n'est pas lancé |
| Le front affiche « API injoignable » | Le back ne tourne pas : `docker compose up -d` dans l'autre terminal |
| `Access denied for user 'quizz'` | Le volume MySQL vient d'une version antérieure du projet. MySQL ne crée l'utilisateur qu'au **tout premier** démarrage sur un volume vide : `docker compose down -v` puis `up -d` (efface la base, elle se remplit toute seule) |
| `/api/categories` renvoie `[]` | Base créée mais pas remplie : `docker compose down -v` puis `up -d` |
| L'API répète `MySQL pas encore prêt...` | Normal ~30 s. Si ça dure : `docker compose logs db` |
| Erreur CORS dans le front | Ajoute l'origine dans `CORS_ALLOWED_ORIGINS` (`docker-compose.yml`), puis `docker compose up -d` |
| `port 8000 is already allocated` | Un autre programme utilise le port : ferme-le |
| `port 3307 is already allocated` | Rare : change `3307` dans `docker-compose.yml` |

Plus de détails sur l'API (format JSON, ajout de questions, fonctionnement interne) : [api/README.md](api/README.md).
