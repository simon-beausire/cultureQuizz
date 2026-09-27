# L'API (FastAPI)

Détails techniques. Pour démarrer le projet, voir le [README à la racine](../README.md).

## Structure

```
api/
├── Dockerfile · requirements.txt · .env.example
├── data/questions.json   # LA source des questions (5 catégories, 250 questions)
└── app/
    ├── main.py           # app, CORS, démarrage
    ├── config.py         # variables d'environnement
    ├── database.py       # connexion MySQL + session par requête
    ├── models.py         # les 2 tables (SQLAlchemy)
    ├── schemas.py        # forme du JSON échangé (Pydantic)
    ├── seed.py           # remplit la base depuis questions.json
    ├── securite.py       # jetons signés des réponses (HMAC)
    └── routers/
        ├── categories.py # liste des catégories, tirage des questions
        └── reponses.py   # POST /api/answer : dit si la réponse est la bonne
```

## Format des réponses

### `GET /api/categories`

```json
[
  { "id": 1, "categorie": "Python", "nbQuestions": 50 },
  { "id": 2, "categorie": "Réseau (CCNA)", "nbQuestions": 50 }
]
```

`nbQuestions` est la taille de la réserve, affichée sur les cartes de l'accueil.

### `GET /api/categories/{id}/questions?vues=3,17,42`

10 questions au hasard, chacune avec 4 réponses mélangées (la bonne + 3 mauvaises tirées au sort).

`vues` liste les questions déjà tombées chez ce joueur (le front les garde dans
`localStorage`). Elles sont **écartées du tirage** tant qu'il reste de quoi
remplir une partie : c'est ce qui empêche la même question de revenir d'une
partie à l'autre. Quand la réserve d'inédites est vide, l'API complète avec le
reste du stock et met `nouveauCycle` à `true` — le front sait alors qu'il peut
oublier l'historique de la catégorie. Un `vues` bricolé (valeurs non entières)
est ignoré sans erreur : au pire le tirage est moins malin.

```json
{
  "categorie": { "id": 1, "categorie": "Python", "nbQuestions": 50 },
  "nouveauCycle": false,
  "jeton": "a3SF-StXzuEaX4bt",
  "questions": [
    {
      "id": 5,
      "question": "Quel mot-clé définit une fonction en Python ?",
      "answers": [
        { "id": "9f2c1ab4e7d05836", "text": "lambda" },
        { "id": "0a241d5bd59e0ac9", "text": "def"    }
      ]
    }
  ]
}
```

Catégorie inexistante → **404** `{ "detail": "Catégorie introuvable." }`
Id non numérique → **422** (FastAPI le rejette avant d'exécuter le code).

### `POST /api/answer`

La charge utile des questions **ne dit pas** quelle réponse est la bonne. L'`id`
d'une réponse est un jeton HMAC calculé sur `(jeton de tirage, id de question,
position en base)` avec `SECRET_KEY` : sans la clé, il est impossible de savoir
lequel des quatre ids correspond à la position 0, celle de la bonne réponse.

```json
{ "jeton": "a3SF-StXzuEaX4bt", "questionId": 5, "answerId": "0a241d5bd59e0ac9" }
```

```json
{ "correct": true, "bonneReponseId": "0a241d5bd59e0ac9" }
```

`bonneReponseId` permet au front d'afficher la bonne réponse en vert même quand
le joueur s'est trompé. `answerId` vaut `null` quand le chrono s'est écoulé sans
réponse : la route renvoie alors `correct: false` et la bonne réponse.

Le jeton de tirage change à chaque appel de la route des questions : les ids d'une
partie ne sont donc pas rejouables sur la suivante.

Question inexistante → **404**.

> ⚠️ **Ce que ça protège, et ce que ça ne protège pas.** Les bonnes réponses ne
> partent plus d'avance : l'onglet réseau ne les révèle plus. En revanche la route
> est sans état, donc rien n'empêche d'appeler `POST /api/answer` avec un
> `answerId` bidon *avant* de répondre pour lire `bonneReponseId`. Et le score
> reste compté par le front. Fermer ces deux trous demanderait de garder la partie
> côté serveur (quelles questions, lesquelles déjà répondues) et d'y déplacer le
> score.

## Les tables

**`categories`** : `id`, `categorie` (nom, unique).

**`questions`** : `id`, `categorie_id` (FK vers `categories.id`, ON DELETE CASCADE), `question`, `answers`.

`answers` est une colonne **JSON** contenant les 10 réponses. **`answers[0]` est toujours la bonne** en base ; le mélange se fait au moment de la requête, jamais en base.

## Les dépendances

`pymysql` est le pilote MySQL derrière l'URL `mysql+pymysql://`, et `cryptography`
lui est indispensable pour parler l'authentification `caching_sha2_password`, celle
que MySQL 8 utilise par défaut — sans elle, la connexion échoue au démarrage.

## `SECRET_KEY`

Elle signe les jetons de réponse, et **doit rester stable** : un jeton émis avec une
clé ne se vérifie qu'avec la même. `docker-compose.yml` en fixe donc une pour le
développement. Sans elle, une clé aléatoire est tirée à chaque démarrage — et comme
uvicorn tourne avec `--reload`, la moindre sauvegarde d'un `.py` invalide toutes les
parties déjà ouvertes dans un navigateur.

En production, fournir une vraie clé par l'environnement ; celle du `docker-compose`
n'a aucune valeur secrète puisqu'elle est dans le dépôt.

Si un jeton ne correspond malgré tout à aucune réponse de la question — clé changée,
onglet resté ouvert — `POST /api/answer` répond **409** plutôt que de compter la
réponse comme fausse. Le front affiche alors « Cette partie n'est plus valide,
relance-la. » avec un bouton *Réessayer*, au lieu de marquer silencieusement les
quatre réponses en rouge.

## Le démarrage

Avant d'accepter la moindre requête, `lifespan()` dans `main.py` fait 3 choses :

1. **`wait_for_database()`** — réessaie jusqu'à 30 fois. Docker attend déjà le *healthcheck* de MySQL, mais MySQL peut encore refuser les toutes premières connexions.
2. **`create_all()`** — crée les tables si elles n'existent pas (l'équivalent de `php artisan migrate`).
3. **`seed()`** — insère de `questions.json` ce qui manque en base, et rien d'autre. Une question déjà présente (même catégorie, même intitulé) est ignorée : on peut redémarrer sans dupliquer, **et** ajouter des questions au fichier sans repartir d'un volume MySQL vide.

## Le tirage des réponses

`pick_answers()` prend l'index 0 (la bonne) + 3 index tirés au sort parmi 1–9, puis mélange. L'`id` d'une réponse est sa **position 1-based** dans la liste stockée : la bonne porte donc toujours l'`id` 1, mais sa **place dans le tableau** change à chaque appel.

Le tirage des questions utilise `ORDER BY rand()` : acceptable avec quelques dizaines de lignes par catégorie, à éviter sur une grosse table.

## Pourquoi du SQLAlchemy synchrone ?

Les routes sont en `def`, pas `async def` : FastAPI les exécute dans un *threadpool*, donc une requête SQL bloquante ne gèle pas le serveur. Plus simple à lire qu'`async` + `aiomysql`, et pour 2 routes en lecture seule le gain serait invisible.

## Ajouter des questions

Tout est dans `data/questions.json` :

```json
{
  "categorie": "Python",
  "questions": [
    {
      "question": "Quel mot-clé définit une fonction en Python ?",
      "reponses": ["def", "function", "func", "fn", "define", "sub", "method", "proc", "void", "declare"]
    }
  ]
}
```

Règles **obligatoires** (sinon l'API refuse de démarrer, en nommant la question fautive) : exactement **10 réponses**, **toutes différentes**, **la première est la bonne**.

Un simple `docker compose restart api` suffit ensuite : le *seed* insère les
nouvelles questions sans toucher aux anciennes.

Plus la réserve d'une catégorie est grande, plus on enchaîne de parties avant de
revoir une question : à 50 questions, cinq parties de suite sont entièrement
inédites.

Pour **retirer ou modifier** des questions existantes, en revanche, le *seed* ne
suffit pas : il n'insère que ce qui manque et ne supprime jamais rien. Il faut
repartir d'une base vide :

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
