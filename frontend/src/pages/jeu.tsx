import { useEffect, useMemo, useState } from "react";
import type { ButtonQuestionState } from "../components/buttonQuestion";
import { ButtonQuestion } from "../components/buttonQuestion";
import { ButtonUtilitaire } from "../components/buttonUtilitaire";
import { questions } from "../data/questions";
import "./jeu.css";

const DUREE = 30;

async function getQuestions() {
  const questions = await fetch("");
  return;
}

function melanger<T>(liste: T[]): T[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

export function Jeu() {
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [corrige, setCorrige] = useState(false);
  const [score, setScore] = useState(0);
  const [temps, setTemps] = useState(DUREE);
  const [fini, setFini] = useState(false);

  const question = questions[index];
  const derniere = index === questions.length - 1;

  const reponses = useMemo(() => melanger(question.choix), [question]);

  useEffect(() => {
    if (corrige || fini) return;
    if (temps === 0) {
      setCorrige(true);
      return;
    }
    const tick = setTimeout(() => setTemps((s) => s - 1), 1000);
    return () => clearTimeout(tick);
  }, [temps, corrige, fini]);

  function valider() {
    if (choix === null) return;
    setCorrige(true);
    if (choix === question.bonneReponse) setScore((s) => s + 1);
  }

  function suivant() {
    if (derniere) {
      setFini(true);
      return;
    }
    setIndex((i) => i + 1);
    setChoix(null);
    setCorrige(false);
    setTemps(DUREE);
  }

  function rejouer() {
    setIndex(0);
    setChoix(null);
    setCorrige(false);
    setScore(0);
    setTemps(DUREE);
    setFini(false);
  }

  function etatCarte(reponse: string): ButtonQuestionState {
    if (!corrige) return reponse === choix ? "selected" : "neutral";
    if (reponse === question.bonneReponse) return "correct";
    if (reponse === choix) return "wrong";
    return "muted";
  }

  if (fini) {
    return (
      <main className="jeu">
        <div className="jeu__screen">
          <div className="jeu__body jeu__body--fin">
            <p className="jeu__fin-titre">Partie terminée</p>
            <p className="jeu__fin-score">
              {score}
              <small>/{questions.length}</small>
            </p>
          </div>
          <div className="jeu__actions">
            <ButtonUtilitaire block icon="↺" onClick={rejouer}>
              Rejouer
            </ButtonUtilitaire>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="jeu">
      <div className="jeu__screen">
        <header className="jeu__head">
          <div className="jeu__head-row">
            <div className="jeu__meta">
              <span className="jeu__pill">
                Question {index + 1}/{questions.length}
              </span>
              <span className="jeu__score">
                {score} pt{score > 1 ? "s" : ""}
              </span>
            </div>
            <span className="jeu__timer">{temps}</span>
          </div>
          <div className="jeu__track">
            <i style={{ width: `${(temps / DUREE) * 100}%` }} />
          </div>
        </header>

        <div className="jeu__body">
          <h1 className="jeu__question">{question.enonce}</h1>
        </div>

        <div className="jeu__answers">
          {reponses.map((reponse, i) => (
            <ButtonQuestion
              key={reponse}
              letter={String.fromCharCode(65 + i)}
              label={reponse}
              state={etatCarte(reponse)}
              chosen={reponse === choix}
              onClick={() => setChoix(reponse)}
            />
          ))}
        </div>

        <div className="jeu__actions">
          {corrige ? (
            <ButtonUtilitaire
              block
              icon="→"
              iconPosition="end"
              onClick={suivant}
            >
              {derniere ? "Voir le résultat" : "Question suivante"}
            </ButtonUtilitaire>
          ) : (
            <ButtonUtilitaire block disabled={choix === null} onClick={valider}>
              Envoyer
            </ButtonUtilitaire>
          )}
        </div>
      </div>
    </main>
  );
}
