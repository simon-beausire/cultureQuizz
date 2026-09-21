import { useEffect, useState } from "react";
import { ButtonQuestion } from "./components/buttonQuestion";
import "./App.css";

const API = "http://localhost:8000/api";
const LETTRES = ["A", "B", "C", "D"];

function App() {
  const [categories, setCategories] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState(null);
  const [score, setScore] = useState(0);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((reponse) => {
        if (!reponse.ok) throw new Error();
        return reponse.json();
      })
      .then(setCategories)
      .catch(() =>
        setErreur("API injoignable. Lance le back avec « docker compose up -d »."),
      );
  }, []);

  async function lancerQuiz(categorieId) {
    setChargement(true);
    setErreur(null);
    try {
      const reponse = await fetch(`${API}/categories/${categorieId}/questions`);
      if (!reponse.ok) throw new Error();
      setQuiz(await reponse.json());
      setIndex(0);
      setChoix(null);
      setScore(0);
    } catch {
      setErreur("Impossible de charger les questions.");
    } finally {
      setChargement(false);
    }
  }

  function repondre(answer) {
    if (choix !== null) return;
    setChoix(answer.id);
    if (answer.isCorrect) setScore(score + 1);
  }

  function suivant() {
    setIndex(index + 1);
    setChoix(null);
  }

  function retourAccueil() {
    setQuiz(null);
    setChoix(null);
    setIndex(0);
    setScore(0);
  }

  if (!quiz) {
    return (
      <main className="cq">
        <h1>Culture Quiz</h1>
        <p className="cq__intro">Choisis une catégorie, 10 questions t'attendent.</p>
        {erreur && <p className="cq__erreur">{erreur}</p>}
        <div className="cq__categories">
          {categories.map((categorie) => (
            <button
              key={categorie.id}
              type="button"
              className="cq__categorie"
              disabled={chargement}
              onClick={() => lancerQuiz(categorie.id)}
            >
              {categorie.categorie}
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (index >= quiz.questions.length) {
    return (
      <main className="cq">
        <h1>Score : {score} / {quiz.questions.length}</h1>
        <p className="cq__intro">Catégorie {quiz.categorie.categorie}</p>
        <div className="cq__categories">
          <button type="button" className="cq__categorie" onClick={() => lancerQuiz(quiz.categorie.id)}>
            Rejouer
          </button>
          <button type="button" className="cq__categorie" onClick={retourAccueil}>
            Changer de catégorie
          </button>
        </div>
      </main>
    );
  }

  const question = quiz.questions[index];

  return (
    <main className="cq">
      <p className="cq__progression">
        {quiz.categorie.categorie} · question {index + 1} / {quiz.questions.length} · score {score}
      </p>
      <h1 className="cq__question">{question.question}</h1>
      <div className="cq__reponses">
        {question.answers.map((answer, position) => (
          <ButtonQuestion
            key={answer.id}
            label={answer.text}
            letter={LETTRES[position]}
            state={
              choix === null
                ? "neutral"
                : answer.isCorrect
                  ? "correct"
                  : answer.id === choix
                    ? "wrong"
                    : "muted"
            }
            chosen={answer.id === choix}
            onClick={() => repondre(answer)}
          />
        ))}
      </div>
      {choix !== null && (
        <button type="button" className="cq__categorie" onClick={suivant}>
          {index + 1 === quiz.questions.length ? "Voir mon score" : "Question suivante"}
        </button>
      )}
    </main>
  );
}

export default App;
