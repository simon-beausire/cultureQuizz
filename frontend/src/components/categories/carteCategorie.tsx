import type { Categorie } from "../../api";

const FORMES: Record<string, string> = {
  Python: "cercle",
  "Réseau (CCNA)": "demi",
  "Tailwind CSS": "goutte",
  Cybersécurité: "losange",
  FastAPI: "point",
};

const FORME_PAR_DEFAUT = "losange";

type CarteCategorieProps = {
  categorie: Categorie;
  onClick: () => void;
};

export function CarteCategorie({ categorie, onClick }: CarteCategorieProps) {
  const forme = FORMES[categorie.categorie] ?? FORME_PAR_DEFAUT;

  return (
    <li className="categories__case">
      <button type="button" className="categories__carte" onClick={onClick}>
        <span className="categories__icone" aria-hidden="true">
          <span className={`categories__forme categories__forme--${forme}`} />
        </span>
        <span className="categories__carte-texte">
          <span className="categories__carte-nom">{categorie.categorie}</span>
          <span className="categories__carte-compte">
            {categorie.nbQuestions} questions
          </span>
        </span>
      </button>
    </li>
  );
}
