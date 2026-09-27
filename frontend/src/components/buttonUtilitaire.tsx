import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonUtilitaireVariant = "primary" | "ghost";

interface ButtonUtilitaireProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonUtilitaireVariant;
  block?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  loading?: boolean;
}

const VARIANT_CLASS: Record<ButtonUtilitaireVariant, string> = {
  primary: "cq-bu--primary",
  ghost: "cq-bu--ghost",
};

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap");

.cq-bu {
  --cq-bu-bg: transparent;
  --cq-bu-border: transparent;
  --cq-bu-fg: #f5f3ff;
  --cq-bu-shadow: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
  height: 54px;
  margin: 0;
  padding: 0 22px;
  border: 1px solid var(--cq-bu-border);
  border-radius: 18px;
  background: var(--cq-bu-bg);
  box-shadow: var(--cq-bu-shadow);
  color: var(--cq-bu-fg);
  font-family: "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-weight: 700;
  font-size: 16px;
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

.cq-bu__icon {
  display: flex;
  flex: none;
  align-items: center;
  font-size: 1.1em;
}

.cq-bu--primary {
  --cq-bu-bg: #7c5cff;
  --cq-bu-border: #7c5cff;
  --cq-bu-shadow: 0 10px 26px rgba(124, 92, 255, .3);
}

.cq-bu--ghost {
  --cq-bu-fg: #a9a3d4;
}

.cq-bu--primary:not(:disabled):hover {
  --cq-bu-bg: #8f72ff;
  --cq-bu-border: #8f72ff;
  --cq-bu-shadow: 0 12px 30px rgba(124, 92, 255, .42);
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

.cq-bu:disabled {
  --cq-bu-bg: #211e47;
  --cq-bu-border: #2f2a5e;
  --cq-bu-fg: #6e689b;
  --cq-bu-shadow: none;
  cursor: default;
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
  block = false,
  icon,
  iconPosition = "start",
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonUtilitaireProps) {
  const classes = ["cq-bu", VARIANT_CLASS[variant]];
  if (block) classes.push("cq-bu--block");

  const decor = loading ? (
    <span className="cq-bu__spinner" aria-hidden="true" />
  ) : icon ? (
    <span className="cq-bu__icon" aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <>
      <style href="cq-button-utilitaire" precedence="medium">
        {CSS}
      </style>
      <button
        type="button"
        {...rest}
        className={classes.join(" ")}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {iconPosition === "start" && decor}
        {children}
        {iconPosition === "end" && decor}
      </button>
    </>
  );
}
