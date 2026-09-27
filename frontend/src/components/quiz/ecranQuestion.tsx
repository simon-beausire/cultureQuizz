import type { ButtonQuestionState } from "../buttonQuestion";
import { ButtonQuestion } from "../buttonQuestion";
import { ButtonUtilitaire } from "../buttonUtilitaire";
import type { Answer, Question } from "../../api";

type EcranQuestionProps = {
  question: Question;
  choix: string | null;
  bonneReponse: string | null;
  corrige: boolean;
  verification: boolean;
  derniere: boolean;
  onChoisir: (id: string) => void;
  onValider: () => void;
  onSuivant: () => void;
};

export function EcranQuestion({
  question,
  choix,
  bonneReponse,
  corrige,
  verification,
  derniere,
  onChoisir,
  onValider,
  onSuivant,
}: EcranQuestionProps) {
  function etatCarte(reponse: Answer): ButtonQuestionState {
    if (!corrige) return reponse.id === choix ? "selected" : "neutral";
    if (reponse.id === bonneReponse) return "correct";
    if (reponse.id === choix) return "wrong";
    return "muted";
  }

  return (
    <>
      <div className="jeu__body">
        <h1 className="jeu__question">{question.question}</h1>
      </div>

      <div className="jeu__answers">
        {question.answers.map((reponse, i) => (
          <ButtonQuestion
            key={reponse.id}
            letter={String.fromCharCode(65 + i)}
            label={reponse.text}
            state={etatCarte(reponse)}
            chosen={reponse.id === choix}
            onClick={() => onChoisir(reponse.id)}
          />
        ))}
      </div>

      <div className="jeu__actions">
        {corrige ? (
          <ButtonUtilitaire block icon="→" iconPosition="end" onClick={onSuivant}>
            {derniere ? "Voir le résultat" : "Question suivante"}
          </ButtonUtilitaire>
        ) : (
          <ButtonUtilitaire
            block
            loading={verification}
            disabled={choix === null}
            onClick={onValider}
          >
            Envoyer
          </ButtonUtilitaire>
        )}
      </div>
    </>
  );
}
