# Culture Quiz — front

React 19 + TypeScript + Vite. **Le back doit tourner** (`docker compose up -d` à la racine) : toutes les questions viennent de l'API, rien n'est en dur.

```bash
npm install     # la première fois
npm run dev     # http://localhost:5173
```

Le lancement complet du projet (back + front) est décrit dans le [README à la racine](../README.md).

## Les fichiers

Les pages n'orchestrent que l'affichage ; l'état vit dans un hook, chaque écran
dans son composant.

| Fichier | Rôle |
|---|---|
| `src/api.ts` | Le seul point de contact avec l'API : types et appels (dont `verifierReponse`) |
| `src/App.tsx` | Les routes : `/` (accueil), `/categories` (choix du thème), `/jeu/:categorieId` (partie), `/resultat` (score) |
| `src/questionsVues.ts` | Mémorise les questions déjà tombées, pour ne pas les rejouer |
| `src/hooks/usePartie.ts` | Toute la mécanique d'une partie : tirage, chrono, score, enchaînement. La correction passe par `POST /api/answer` — le front ne connaît jamais la bonne réponse d'avance |
| `src/pages/accueil.tsx` | Page d'accueil : la marque et le bouton « Commencer » |
| `src/pages/categories.tsx` | Choix du thème : charge les catégories et compose la grille |
| `src/pages/jeu.tsx` | Page de jeu : choisit l'écran à afficher, et bascule vers `/resultat` en fin de partie |
| `src/pages/resultat.tsx` | Page de score : lit le résultat dans l'état de navigation |
| `src/components/categories/carteCategorie.tsx` | Une carte de catégorie (forme, nom, nombre de questions) |
| `src/components/categories/grilleSquelette.tsx` | La grille fantôme affichée pendant le chargement |
| `src/components/quiz/enTetePartie.tsx` | En-tête : catégorie, progression, score, chrono |
| `src/components/quiz/ecranQuestion.tsx` | La question, ses 4 réponses et le bouton d'action |
| `src/components/quiz/ecranResultat.tsx` | Le score final et les deux sorties (rendu par `/resultat`) |
| `src/components/quiz/ecranChargement.tsx` | « Chargement des questions… » |
| `src/components/quiz/ecranErreur.tsx` | Le message d'erreur, Réessayer et Retour à l'accueil |
| `src/components/buttonQuestion.tsx` | La carte-réponse et ses 5 états |
| `src/components/buttonUtilitaire.tsx` | Le bouton d'action (Envoyer, Suivant, Rejouer) |

Les deux boutons portent leur CSS avec eux. Les écrans partagent la feuille de
leur page (`accueil.css`, `categories.css`, `jeu.css`), importée une fois par la page : les composants
d'écran n'importent donc pas de CSS eux-mêmes.

## Le passage à `/resultat`

Le score ne vit qu'en mémoire dans `usePartie`. Quand la partie se termine, `jeu.tsx`
rend un `<Navigate to="/resultat" replace state={…} />` qui emporte la catégorie, le
score et le total.

`replace` plutôt qu'une navigation normale : l'entrée `/jeu/:id` est **remplacée**, donc
le bouton Retour du navigateur ramène au choix du thème et non dans une partie qui
recommencerait toute seule.

React Router range cet état dans `history.state`, que le navigateur restaure : un F5
sur `/resultat` conserve donc le score. En revanche, ouvrir `/resultat` à froid — URL
tapée, lien partagé — n'a aucun état : la page redirige alors vers `/categories`.

## Les commandes

```bash
npm run dev       # serveur de dev
npm run build     # build de production dans dist/
npm run lint      # ESLint
npx tsc --noEmit  # vérification TypeScript
```
