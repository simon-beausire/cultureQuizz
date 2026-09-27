type EnTetePartieProps = {
  categorie: string;
  index: number;
  total: number;
  score: number;
  temps: number;
  duree: number;
};

export function EnTetePartie({
  categorie,
  index,
  total,
  score,
  temps,
  duree,
}: EnTetePartieProps) {
  return (
    <header className="jeu__head">
      <div className="jeu__head-row">
        <div className="jeu__meta">
          <span className="jeu__pill">
            {categorie} · {index + 1}/{total}
          </span>
          <span className="jeu__score">
            {score} pt{score > 1 ? "s" : ""}
          </span>
        </div>
        <span className="jeu__timer">{temps}</span>
      </div>
      <div className="jeu__track">
        <i style={{ width: `${(temps / duree) * 100}%` }} />
      </div>
    </header>
  );
}
