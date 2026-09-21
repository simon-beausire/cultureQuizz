# L'API (FastAPI)

Détails techniques. Pour démarrer le projet, voir le [README à la racine](../README.md).

## Structure

```
api/
├── Dockerfile · requirements.txt · .env.example
├── data/questions.json   # LA source des questions (5 catégories, 60 questions)
└── app/
    ├── main.py           # app, CORS, démarrage
    ├── config.py         # variables d'environnement
    ├── database.py       # connexion MySQL + session par requête
    ├── models.py         # les 2 tables (SQLAlchemy)
    ├── schemas.py        # forme du JSON renvoyé (Pydantic)
    ├── seed.py           # remplit la base depuis questions.json
    └── routers/categories.py   # les 2 routes du quiz
```

## Format des réponses

### `GET /api/categories`

```json
[
  { "id": 1, "categorie": "Histoire" },
  { "id": 2, "categorie": "Géographie" }
]
```

### `GET /api/categories/{id}/questions`

10 questions au hasard, chacune avec 4 réponses mélangées (la bonne + 3 mauvaises tirées au sort).

```json
{
  "categorie": { "id": 1, "categorie": "Histoire" },
  "questions": [
    {
      "id": 5,
      "question": "Qui a été la première femme à recevoir un prix Nobel ?",
      "answers": [
        { "id": 10, "text": "Hypatie",     "isCorrect": false },
        { "id": 1,  "text": "Marie Curie", "isCorrect": true  }
      ]
    }
  ]
}
```

Catégorie inexistante → **404** `{ "detail": "Catégorie introuvable." }`
Id non numérique → **422** (FastAPI le rejette avant d'exécuter le code).

> ⚠️ `isCorrect` est envoyé au front : un joueur peut lire les bonnes réponses dans l'onglet réseau. C'est volontaire ici. Pour un vrai score anti-triche, il faudrait une route `POST /api/answer` qui vérifie côté serveur.

## Les tables

**`categories`** : `id`, `categorie` (nom, unique).

**`questions`** : `id`, `categorie_id` (FK vers `categories.id`, ON DELETE CASCADE), `question`, `answers`.

`answers` est une colonne **JSON** contenant les 10 réponses. **`answers[0]` est toujours la bonne** en base ; le mélange se fait au moment de la requête, jamais en base.

## Le démarrage

Avant d'accepter la moindre requête, `lifespan()` dans `main.py` fait 3 choses :

1. **`wait_for_database()`** — réessaie jusqu'à 30 fois. Docker attend déjà le *healthcheck* de MySQL, mais MySQL peut encore refuser les toutes premières connexions.
2. **`create_all()`** — crée les tables si elles n'existent pas (l'équivalent de `php artisan migrate`).
3. **`seed()`** — si `questions` est vide, insère tout `questions.json`. Sinon ne fait **rien** : on peut redémarrer sans dupliquer.

## Le tirage des réponses

`pick_answers()` prend l'index 0 (la bonne) + 3 index tirés au sort parmi 1–9, puis mélange. L'`id` d'une réponse est sa **position 1-based** dans la liste stockée : la bonne porte donc toujours l'`id` 1, mais sa **place dans le tableau** change à chaque appel.

Le tirage des questions utilise `ORDER BY rand()` : acceptable avec quelques dizaines de lignes par catégorie, à éviter sur une grosse table.

## Pourquoi du SQLAlchemy synchrone ?

Les routes sont en `def`, pas `async def` : FastAPI les exécute dans un *threadpool*, donc une requête SQL bloquante ne gèle pas le serveur. Plus simple à lire qu'`async` + `aiomysql`, et pour 2 routes en lecture seule le gain serait invisible.

## Ajouter des questions

Tout est dans `data/questions.json` :

```json
{
  "categorie": "Histoire",
  "questions": [
    {
      "question": "En quelle année a eu lieu la prise de la Bastille ?",
      "reponses": ["1789", "1792", "1776", "1815", "1799", "1804", "1830", "1848", "1774", "1793"]
    }
  ]
}
```

Règles **obligatoires** (sinon l'API refuse de démarrer, en nommant la question fautive) : exactement **10 réponses**, **toutes différentes**, **la première est la bonne**.

Le seed ne tourne que sur une base vide, donc il faut la remettre à zéro :

```bash
docker compose down -v      # -v supprime le volume, donc les données
docker compose up -d
```

## Lancer l'API sans Docker

Il faut un MySQL qui tourne quelque part.

```bash
cd api
python -m venv .venv
.venv\Scripts\activate          # Windows  (source .venv/bin/activate sur macOS/Linux)
pip install -r requirements.txt

cp .env.example .env            # puis ajuste si besoin
uvicorn app.main:app --reload
```

`.env.example` pointe sur `127.0.0.1:3307`, le MySQL du `docker compose` vu depuis Windows. Tu peux donc ne lancer que la base : `docker compose up -d db`.

## Ce qui a changé depuis Laravel

Les URL et le JSON renvoyé sont **identiques** : le front n'a rien à changer.

| Avant (Laravel 8) | Maintenant (FastAPI) |
|---|---|
| `routes/api.php` | `app/routers/categories.py` |
| `CategorieController` | `list_categories()` / `questions()` |
| Modèles Eloquent | modèles SQLAlchemy (`app/models.py`) |
| Migrations PHP | `create_all()` au démarrage |
| Seeders + `artisan migrate --seed` | `app/seed.py`, automatique |
| `config/cors.php` | `CORSMiddleware` dans `app/main.py` |
| (pas de doc) | `/docs` générée automatiquement |

Simplifications au passage :

- Suppression de tout ce que le quiz n'utilisait pas : `users`, `password_resets`, `failed_jobs`, `personal_access_tokens`, Sanctum, Blade, le dossier vide `backend/` et le dump `culturequizz.sql` (redondant avec `questions.json`).
- Les colonnes `reponse1` … `reponse10` sont remplacées par **une** colonne JSON `answers`.
- La clé étrangère pointe sur `categories.id` (un entier) au lieu du **nom** de la catégorie.
