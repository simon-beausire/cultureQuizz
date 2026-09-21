import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * ButtonUtilitaire — le bouton d'action du quiz.
 *
 * Design « Culture Quiz » → Design System / Bouton utilitaire, le pendant de
 * [ButtonQuestion] pour tout ce qui fait avancer la partie : « Envoyer »,
 * « Suivant », « Passer », « Quitter »…
 *
 * primary   : l'action principale de l'écran (Envoyer, Suivant).
 * secondary : une action de même poids mais non prioritaire (Rejouer).
 * ghost     : une sortie discrète (Passer, Quitter).
 */

export type ButtonUtilitaireVariant = "primary" | "secondary" | "ghost";

type NativeButtonProps = Omit<ComponentPropsWithoutRef<"button">, "aria-busy">;

export interface ButtonUtilitaireProps extends NativeButtonProps {
  /** Allure du bouton. */
  variant?: ButtonUtilitaireVariant;
  /** Hauteur : 54 px pour l'action de bas d'écran, 40 px dans l'en-tête. */
  size?: "md" | "sm";
  /** Occupe toute la largeur disponible (l'« Envoyer » du bas d'écran). */
  block?: boolean;
  /** Décor de gauche ou de droite : flèche, emoji, icône. Jamais lu à voix haute. */
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  /** Requête en cours : le bouton se verrouille et affiche son témoin. */
  loading?: boolean;
}

const VARIANT_CLASS: Record<ButtonUtilitaireVariant, string> = {
  primary: "cq-bu--primary",
  secondary: "cq-bu--secondary",
  ghost: "cq-bu--ghost",
};

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap");

.cq-bu {
  --cq-bu-bg: transparent;
  --cq-bu-border: transparent;
  --cq-bu-fg: #f5f3ff;
  --cq-bu-shadow: none;
  --cq-bu-height: 54px;
  --cq-bu-padding: 22px;
  --cq-bu-radius: 18px;
  --cq-bu-font: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
  height: var(--cq-bu-height);
  margin: 0;
  padding: 0 var(--cq-bu-padding);
  border: 1px solid var(--cq-bu-border);
  border-radius: var(--cq-bu-radius);
  background: var(--cq-bu-bg);
  box-shadow: var(--cq-bu-shadow);
  color: var(--cq-bu-fg);
  font-family: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-weight: 700;
  font-size: var(--cq-bu-font);
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .18s ease, border-color .18s ease,
              color .18s ease, box-shadow .18s ease, transform .12s ease;
}

.cq-bu--block {
  display: flex;
  width: 100%;
}

.cq-bu--sm {
  --cq-bu-height: 40px;
  --cq-bu-padding: 16px;
  --cq-bu-radius: 14px;
  --cq-bu-font: 14px;
}

.cq-bu__icon {
  display: flex;
  flex: none;
  align-items: center;
  font-size: 1.1em;
}

/* ── Les 3 allures ──────────────────────────────────────────────── */

.cq-bu--primary {
  --cq-bu-bg: #7c5cff;
  --cq-bu-border: #7c5cff;
  --cq-bu-shadow: 0 10px 26px rgba(124, 92, 255, .3);
}

.cq-bu--secondary {
  --cq-bu-bg: #262252;
  --cq-bu-border: #3a3570;
}

.cq-bu--ghost {
  --cq-bu-fg: #a9a3d4;
}

/* ── Interactions, tant que le bouton est actionnable ───────────── */

.cq-bu--primary:not(:disabled):hover {
  --cq-bu-bg: #8f72ff;
  --cq-bu-border: #8f72ff;
  --cq-bu-shadow: 0 12px 30px rgba(124, 92, 255, .42);
}

.cq-bu--secondary:not(:disabled):hover {
  --cq-bu-bg: #2b2760;
  --cq-bu-border: #4b4680;
}

.cq-bu--ghost:not(:disabled):hover {
  --cq-bu-bg: rgba(124, 92, 255, .12);
  --cq-bu-fg: #f5f3ff;
}

.cq-bu:not(:disabled):active {
  transform: scale(.985);
}

.cq-bu:focus-visible {
  outline: 2px solid #7c5cff;
  outline-offset: 3px;
}

/* Verrouillé : « Envoyer » sans réponse choisie, ou requête en vol. */
.cq-bu:disabled {
  --cq-bu-bg: #211e47;
  --cq-bu-border: #2f2a5e;
  --cq-bu-fg: #6e689b;
  --cq-bu-shadow: none;
  cursor: default;
}

.cq-bu--ghost:disabled {
  --cq-bu-bg: transparent;
  --cq-bu-border: transparent;
}

.cq-bu__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: cq-bu-spin .7s linear infinite;
}

@keyframes cq-bu-spin {
  to { transform: rotate(1turn); }
}

@media (prefers-reduced-motion: reduce) {
  .cq-bu {
    transition: none;
  }
  .cq-bu:not(:disabled):active {
    transform: none;
  }
  .cq-bu__spinner {
    animation-duration: 2.4s;
  }
}
`;

export function ButtonUtilitaire({
  variant = "primary",
  size = "md",
  block = false,
  icon,
  iconPosition = "start",
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonUtilitaireProps) {
  const classes = ["cq-bu", VARIANT_CLASS[variant]];
  if (size === "sm") classes.push("cq-bu--sm");
  if (block) classes.push("cq-bu--block");
  if (className) classes.push(className);

  /* Le témoin de chargement prend la place de l'icône : la largeur ne saute pas. */
  const decor = loading ? (
    <span className="cq-bu__spinner" aria-hidden="true" />
  ) : icon ? (
    <span className="cq-bu__icon" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <>
      {/* React 19 remonte la feuille dans <head> et la dédoublonne par href. */}
      <style href="cq-button-utilitaire" precedence="medium">
        {CSS}
      </style>
      <button
        type="button"
        className={classes.join(" ")}
        disabled={disabled ?? loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {iconPosition === "start" && decor}
        {children}
        {iconPosition === "end" && decor}
      </button>
    </>
  );
}
