/**
 * Le jeu de questions de la partie.
 *
 * Jeu d'essai en dur, en attendant l'API Laravel : le jour où elle répond, seul
 * l'approvisionnement change (un fetch dans `Jeu`), pas la forme des données.
 *
 * `choix` contient déjà la bonne réponse ; l'ordre d'affichage est mélangé à
 * l'écran, pas ici — voir `melanger` dans `jeu.tsx`.
 */

export type Question = {
  id: number;
  enonce: string;
  choix: string[];
  bonneReponse: string;
};

export const questions: Question[] = [
  {
    id: 1,
    enonce: "Quelle est la capitale de la France ?",
    choix: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    bonneReponse: "Paris",
  },
  {
    id: 2,
    enonce: "Qui a peint La Joconde ?",
    choix: ["Léonard de Vinci", "Michel-Ange", "Raphaël", "Botticelli"],
    bonneReponse: "Léonard de Vinci",
  },
  {
    id: 3,
    enonce: "Quelle planète est la plus proche du Soleil ?",
    choix: ["Mercure", "Vénus", "Mars", "Jupiter"],
    bonneReponse: "Mercure",
  },
  {
    id: 4,
    enonce: "En quelle année débute la Révolution française ?",
    choix: ["1789", "1515", "1799", "1848"],
    bonneReponse: "1789",
  },
  {
    id: 5,
    enonce: "Combien de côtés compte un hexagone ?",
    choix: ["6", "5", "7", "8"],
    bonneReponse: "6",
  },
];
