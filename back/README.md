# Culture Quiz — Backend (Laravel 8 API)

REST API for the Culture Quiz project (Ynov). It serves the quiz categories and, for a category, 10 random questions with 4 shuffled answers each. The React front consumes it from `http://localhost:5173`.

Everything (MySQL database + Laravel API) runs in Docker: **you don't need to install PHP, Composer or MySQL.**

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (started before running the commands)

That's it.

## Project layout

```
cultureQuizz/
├── docker-compose.yml      # db (MySQL 8) + api (Laravel) services
├── culturequizz.sql        # database export delivered with the project
├── back/                   # this Laravel API
│   ├── Dockerfile          # PHP 8.1 image with Composer
│   ├── app/Http/Controllers/CategorieController.php
│   ├── app/Models/Categorie.php, Question.php
│   ├── database/migrations/ # categories + questions tables
│   ├── database/seeders/    # CategorieSeeder, QuestionSeeder, questions.json
│   └── routes/api.php
└── frontend/               # React app (not part of this README)
```

## Getting started

All commands are run **from the repository root** (where `docker-compose.yml` is).

```bash
# 1. Build the images and start MySQL + the API in the background
docker compose up -d --build

# 2. Create the tables and insert the questions (first start, or to reset the data)
docker compose exec api php artisan migrate:fresh --seed
```

The API is now available at **http://localhost:8000**.

On the very first start, the `api` container runs `composer install` (it can take a minute or two) and creates `back/.env` from `back/.env.example` if it doesn't exist. Follow the progress with:

```bash
docker compose logs -f api
```

When you see `Development Server (http://0.0.0.0:8000) started`, the API is ready.

## Everyday commands

| What | Command |
|---|---|
| Start | `docker compose up -d` |
| Stop (data is kept) | `docker compose down` |
| See API logs | `docker compose logs -f api` |
| Reset the data (drop tables, re-run migrations and seeders) | `docker compose exec api php artisan migrate:fresh --seed` |
| Reset everything, including the MySQL volume | `docker compose down -v` then `docker compose up -d --build` and the migrate command |
| Clear Laravel's cached config (after editing `.env`) | `docker compose exec api php artisan config:clear` |
| Any other artisan command | `docker compose exec api php artisan <command>` |

## Configuration

`back/.env` (copied from `back/.env.example`, never committed):

```env
DB_CONNECTION=mysql
DB_HOST=db              # name of the MySQL service in docker-compose.yml
DB_PORT=3306            # port inside the Docker network
DB_DATABASE=mon_projet_db
DB_USERNAME=mon_utilisateur
DB_PASSWORD=mon_mot_de_passe
```

- The API reaches MySQL through Docker's internal network (`db:3306`).
- From your own computer (e.g. MySQL Workbench), MySQL is exposed on **`localhost:3307`**, because port 3306 is often already used by a local MySQL installation.
- CORS allows `http://localhost:5173` and `http://127.0.0.1:5173` (Vite dev server). To allow other origins, set `CORS_ALLOWED_ORIGINS` in `.env` (comma-separated) then run `config:clear`.

## Database

**`categories`**

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, auto-increment | |
| `categorie` | varchar, unique | category name |

**`questions`**

| Column | Type | Notes |
|---|---|---|
| `id` | bigint, auto-increment | |
| `categorie` | varchar | category **name**, foreign key to `categories.categorie` |
| `question` | varchar | question text |
| `reponse1` | varchar | **always the correct answer** |
| `reponse2` … `reponse10` | varchar | 9 wrong answers |

## Endpoints

### `GET /api/categories`

List of all categories.

```bash
curl http://localhost:8000/api/categories
```

```json
[
  { "id": 1, "categorie": "Histoire" },
  { "id": 2, "categorie": "Géographie" },
  { "id": 3, "categorie": "Sciences" },
  { "id": 4, "categorie": "Arts et Littérature" },
  { "id": 5, "categorie": "Sport" }
]
```

### `GET /api/categories/{id}/questions`

10 random questions from the category. Each question has 4 answers: the correct one + 3 wrong ones picked at random among the 9 stored, in random order. Exactly one answer has `"isCorrect": true`. Each call returns a different selection.

The answer `id` is the number of the answer column (`1` = `reponse1`, …).

```bash
curl http://localhost:8000/api/categories/2/questions
```

```json
{
  "categorie": { "id": 2, "categorie": "Géographie" },
  "questions": [
    {
      "id": 22,
      "question": "Quelle mer borde la ville de Marseille ?",
      "answers": [
        { "id": 2, "text": "La Manche", "isCorrect": false },
        { "id": 1, "text": "La mer Méditerranée", "isCorrect": true },
        { "id": 5, "text": "La mer Baltique", "isCorrect": false },
        { "id": 9, "text": "La mer Égée", "isCorrect": false }
      ]
    }
  ]
}
```

(The real response contains 10 questions.)

### Errors

Errors are JSON with a French message and HTTP status 404:

```bash
curl http://localhost:8000/api/categories/999/questions
```

```json
{ "message": "Catégorie introuvable." }
```

Any unknown API URL (for example `/api/categories/abc/questions`) returns:

```json
{ "message": "Ressource introuvable." }
```

### Using it from React

```js
const res = await fetch("http://localhost:8000/api/categories/1/questions");
const { categorie, questions } = await res.json();
```

## Adding questions

Questions live in **`back/database/seeders/questions.json`**:

```json
{
  "categories": [
    {
      "categorie": "Histoire",
      "questions": [
        {
          "question": "En quelle année a eu lieu la prise de la Bastille ?",
          "reponses": ["1789", "1792", "1776", "1815", "1799", "1804", "1830", "1848", "1774", "1793"]
        }
      ]
    }
  ]
}
```

Rules:

1. **The first answer in `reponses` is the correct one.**
2. Each question needs **exactly 10 different answers** (the seeder stops with an error otherwise).
3. A category needs **at least 10 questions** to fill a full quiz (with more, each quiz is a different mix).
4. To add a new category, add a new `{ "categorie": ..., "questions": [...] }` block.

Then reload the data (this deletes and recreates the tables):

```bash
docker compose exec api php artisan migrate:fresh --seed
```

Don't forget to export the database again (see below) so `culturequizz.sql` stays up to date.

## Exporting the database

The export is `culturequizz.sql` at the repository root. Regenerate it with these two commands (they work in PowerShell, Git Bash, macOS and Linux):

```bash
docker compose exec db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u "$MYSQL_USER" --no-tablespaces --default-character-set=utf8mb4 "$MYSQL_DATABASE" > /tmp/culturequizz.sql'
docker compose cp db:/tmp/culturequizz.sql ./culturequizz.sql
```

The dump is created inside the MySQL container and then copied out, which avoids encoding problems with `>` redirections in Windows PowerShell. `--no-tablespaces` avoids a permission error, since `mon_utilisateur` is not a MySQL admin.

### Importing the export (without Laravel)

```bash
docker compose cp ./culturequizz.sql db:/tmp/culturequizz.sql
docker compose exec db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u "$MYSQL_USER" "$MYSQL_DATABASE" < /tmp/culturequizz.sql'
```
