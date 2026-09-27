import { Navigate, useNavigate, useParams } from "react-router-dom";
import { EcranChargement } from "../components/quiz/ecranChargement";
import { EcranErreur } from "../components/quiz/ecranErreur";
import { EcranQuestion } from "../components/quiz/ecranQuestion";
import { EnTetePartie } from "../components/quiz/enTetePartie";
import { usePartie } from "../hooks/usePartie";
import type { ResultatState } from "./resultat";
import "./jeu.css";

export function Jeu() {
  const { categorieId } = useParams();
  const navigate = useNavigate();
  const partie = usePartie(categorieId ?? "");

  if (partie.fini && partie.quiz) {
    const resultat: ResultatState = {
      categorieId: categorieId ?? "",
      categorie: partie.quiz.categorie.categorie,
      score: partie.score,
      total: partie.total,
    };
    return <Navigate to="/resultat" replace state={resultat} />;
  }

  return (
    <main className="jeu">
      <div className="jeu__screen">
        {partie.erreur ? (
          <EcranErreur
            message={partie.erreur}
            onReessayer={partie.rejouer}
            onRetourAccueil={() => navigate("/")}
          />
        ) : !partie.quiz || !partie.question ? (
          <EcranChargement />
        ) : (
          <>
            <EnTetePartie
              categorie={partie.quiz.categorie.categorie}
              index={partie.index}
              total={partie.total}
              score={partie.score}
              temps={partie.temps}
              duree={partie.duree}
            />
            <EcranQuestion
              question={partie.question}
              choix={partie.choix}
              bonneReponse={partie.bonneReponse}
              corrige={partie.corrige}
              verification={partie.verification}
              derniere={partie.derniere}
              onChoisir={partie.choisir}
              onValider={partie.valider}
              onSuivant={partie.suivant}
            />
          </>
        )}
      </div>
    </main>
  );
}
