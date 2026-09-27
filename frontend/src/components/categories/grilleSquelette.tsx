const LARGEURS = [72, 58, 50, 66, 70, 84];

export function GrilleSquelette() {
  return (
    <ul className="categories__grille">
      {LARGEURS.map((largeur, i) => (
        <li className="categories__case" key={i} aria-hidden="true">
          <div className="categories__fantome">
            <span className="categories__fantome-icone" />
            <span className="categories__fantome-lignes">
              <span style={{ width: `${largeur}%` }} />
              <span />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
