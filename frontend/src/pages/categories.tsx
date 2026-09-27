import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarteCategorie } from "../components/categories/carteCategorie";
import { GrilleSquelette } from "../components/categories/grilleSquelette";
import { ButtonUtilitaire } from "../components/buttonUtilitaire";
import type { Categorie } from "../api";
import { getCategories, messageErreur } from "../api";
import "./categories.css";

export function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categorie[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [essai, setEssai] = useState(0);

  useEffect(() => {
    let vivant = true;
    setCategories(null);
    setErreur(null);

    getCategories()
      .then((liste) => vivant && setCategories(liste))
      .catch((cause) => vivant && setErreur(messageErreur(cause)));

    return () => {
      vivant = false;
    };
  }, [essai]);

  const chargement = categories === null && erreur === null;

  return (
    <main className="categories">
      <div className="categories__screen">
        <section className="categories__choix">
          <div className="categories__choix-tete">
            <h1 className="categories__choix-titre">Choisis ta catégorie</h1>
            {chargement ? (
              <span className="categories__barre" aria-hidden="true" />
            ) : (
              <p className="categories__choix-sous">
                {categories?.length ?? 0} thèmes · 10 questions par partie
              </p>
            )}
          </div>

          {erreur ? (
            <div className="categories__alerte">
              <p className="categories__erreur">{erreur}</p>
              <ButtonUtilitaire block icon="↺" onClick={() => setEssai((n) => n + 1)}>
                Réessayer
              </ButtonUtilitaire>
            </div>
          ) : chargement ? (
            <GrilleSquelette />
          ) : (
            <ul className="categories__grille">
              {categories?.map((categorie) => (
                <CarteCategorie
                  key={categorie.id}
                  categorie={categorie}
                  onClick={() => navigate(`/jeu/${categorie.id}`)}
                />
              ))}
            </ul>
          )}
        </section>

        {chargement && (
          <p className="categories__attente">
            <span className="categories__puce" aria-hidden="true" />
            Chargement des catégories…
          </p>
        )}
      </div>
    </main>
  );
}
