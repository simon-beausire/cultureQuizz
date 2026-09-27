import { useCallback, useEffect, useRef, useState } from "react";
import type { Question, Quiz } from "../api";
import { getQuiz, messageErreur, verifierReponse } from "../api";
import { noterQuestionsVues, questionsVues } from "../questionsVues";

export const DUREE = 30;

export type Partie = {
  quiz: Quiz | null;
  erreur: string | null;
  question: Question | null;
  index: number;
  total: number;
  derniere: boolean;
  choix: string | null;
  bonneReponse: string | null;
  corrige: boolean;
  verification: boolean;
  score: number;
  temps: number;
  duree: number;
  fini: boolean;
  choisir: (id: string) => void;
  valider: () => void;
  suivant: () => void;
  rejouer: () => void;
};

export function usePartie(categorieId: string): Partie {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [manche, setManche] = useState(0);

  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [bonneReponse, setBonneReponse] = useState<string | null>(null);
  const [verification, setVerification] = useState(false);
  const [score, setScore] = useState(0);
  const [temps, setTemps] = useState(DUREE);
  const [fini, setFini] = useState(false);

  const enVol = useRef(false);

  useEffect(() => {
    let vivant = true;
    setQuiz(null);
    setErreur(null);

    getQuiz(categorieId, questionsVues(categorieId))
      .then((donnees) => {
        if (!vivant) return;
        if (donnees.questions.length === 0) {
          setErreur("Cette catégorie ne contient aucune question.");
          return;
        }
        noterQuestionsVues(
          categorieId,
          donnees.questions.map((q) => q.id),
          donnees.nouveauCycle,
        );
        enVol.current = false;
        setQuiz(donnees);
        setIndex(0);
        setChoix(null);
        setBonneReponse(null);
        setVerification(false);
        setScore(0);
        setTemps(DUREE);
        setFini(false);
      })
      .catch((cause) => vivant && setErreur(messageErreur(cause)));

    return () => {
      vivant = false;
    };
  }, [categorieId, manche]);

  const question = quiz?.questions[index] ?? null;
  const total = quiz?.questions.length ?? 0;
  const derniere = total > 0 && index === total - 1;
  const corrige = bonneReponse !== null;

  const choisir = useCallback((id: string) => setChoix(id), []);

  const valider = useCallback(() => {
    if (!quiz || question === null || enVol.current || bonneReponse !== null) return;

    enVol.current = true;
    setVerification(true);

    verifierReponse(quiz.jeton, question.id, choix)
      .then((verdict) => {
        setBonneReponse(verdict.bonneReponseId);
        if (verdict.correct) setScore((s) => s + 1);
      })
      .catch((cause) => setErreur(messageErreur(cause)))
      .finally(() => {
        enVol.current = false;
        setVerification(false);
      });
  }, [quiz, question, choix, bonneReponse]);

  useEffect(() => {
    if (!quiz || corrige || fini || verification) return;
    if (temps === 0) {
      valider();
      return;
    }
    const tick = setTimeout(() => setTemps((s) => s - 1), 1000);
    return () => clearTimeout(tick);
  }, [quiz, temps, corrige, fini, verification, valider]);

  const suivant = useCallback(() => {
    if (derniere) {
      setFini(true);
      return;
    }
    setIndex((i) => i + 1);
    setChoix(null);
    setBonneReponse(null);
    setTemps(DUREE);
  }, [derniere]);

  const rejouer = useCallback(() => setManche((n) => n + 1), []);

  return {
    quiz,
    erreur,
    question,
    index,
    total,
    derniere,
    choix,
    bonneReponse,
    corrige,
    verification,
    score,
    temps,
    duree: DUREE,
    fini,
    choisir,
    valider,
    suivant,
    rejouer,
  };
}
