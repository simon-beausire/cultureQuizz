import { useNavigate } from "react-router-dom";
import { ButtonUtilitaire } from "../components/buttonUtilitaire";
import "./accueil.css";

export function Accueil() {
  const navigate = useNavigate();
  const commencer = () => navigate("/categories");

  return (
    <main className="accueil" onClick={commencer}>
      <div className="accueil__screen">
        <div className="accueil__logo" aria-hidden="true">
          <span className="accueil__logo-losange" />
          <span className="accueil__logo-point" />
          <span className="accueil__logo-marque">?</span>
        </div>

        <div className="accueil__marque">
          <h1 className="accueil__titre">Culture Quiz</h1>
          <p className="accueil__intro">
            10 questions, 30 secondes chacune. Jusqu'où va ta culture&nbsp;?
          </p>
        </div>

        <div className="accueil__actions">
          <ButtonUtilitaire block onClick={commencer}>
            Commencer
          </ButtonUtilitaire>
          <p className="accueil__indice">clique n'importe où pour continuer</p>
        </div>
      </div>
    </main>
  );
}
