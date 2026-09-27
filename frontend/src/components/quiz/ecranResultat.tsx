import { ButtonUtilitaire } from "../buttonUtilitaire";

type EcranResultatProps = {
  categorie: string;
  score: number;
  total: number;
  onRejouer: () => void;
  onChangerCategorie: () => void;
};

export function EcranResultat({
  categorie,
  score,
  total,
  onRejouer,
  onChangerCategorie,
}: EcranResultatProps) {
  return (
    <>
      <div className="jeu__body jeu__body--fin">
        <p className="jeu__fin-titre">Partie terminée · {categorie}</p>
        <p className="jeu__fin-score">
          {score}
          <small>/{total}</small>
        </p>
      </div>

      <div className="jeu__actions jeu__actions--duo">
        <ButtonUtilitaire block icon="↺" onClick={onRejouer}>
          Rejouer
        </ButtonUtilitaire>
        <ButtonUtilitaire block variant="ghost" onClick={onChangerCategorie}>
          Changer de catégorie
        </ButtonUtilitaire>
      </div>
    </>
  );
}
