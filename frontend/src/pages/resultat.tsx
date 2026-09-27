import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { EcranResultat } from "../components/quiz/ecranResultat";
import "./jeu.css";

export type ResultatState = {
  categorieId: string;
  categorie: string;
  score: number;
  total: number;
};

function estResultat(valeur: unknown): valeur is ResultatState {
  const v = valeur as ResultatState | null;
  return (
    !!v &&
    typeof v.categorieId === "string" &&
    typeof v.categorie === "string" &&
    typeof v.score === "number" &&
    typeof v.total === "number"
  );
}

export function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!estResultat(state)) return <Navigate to="/categories" replace />;

  return (
    <main className="jeu">
      <div className="jeu__screen">
        <EcranResultat
          categorie={state.categorie}
          score={state.score}
          total={state.total}
          onRejouer={() => navigate(`/jeu/${state.categorieId}`)}
          onChangerCategorie={() => navigate("/categories")}
        />
      </div>
    </main>
  );
}
