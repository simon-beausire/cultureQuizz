import type { ComponentPropsWithoutRef } from "react";

export type ButtonQuestionState =
  | "neutral"
  | "selected"
  | "correct"
  | "wrong"
  | "muted";

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "aria-label" | "aria-pressed"
>;

interface ButtonQuestionProps extends NativeButtonProps {
  label: string;
  letter?: string;
  state?: ButtonQuestionState;
  chosen?: boolean;
}

const STATE_CLASS: Record<ButtonQuestionState, string> = {
  neutral: "cq-aq--neutral",
  selected: "cq-aq--selected",
  correct: "cq-aq--correct",
  wrong: "cq-aq--wrong",
  muted: "cq-aq--muted",
};

const BADGE_SYMBOL: Partial<Record<ButtonQuestionState, string>> = {
  correct: "✓",
  wrong: "✕",
};

const STATE_HINT: Partial<Record<ButtonQuestionState, string>> = {
  correct: "— bonne réponse",
  wrong: "— mauvaise réponse",
};

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500&display=swap");

.cq-aq {
  --cq-aq-bg: #262252;
  --cq-aq-border: #3a3570;
  --cq-aq-shadow: none;
  --cq-aq-badge-bg: #312c63;
  --cq-aq-badge-fg: #a9a3d4;
  --cq-aq-badge-size: 14px;
  --cq-aq-label: #f5f3ff;
  --cq-aq-label-weight: 400;

  display: flex;
  align-items: center;
  gap: 14px;
  box-sizing: border-box;
  width: 100%;
  min-height: 62px;
  margin: 0;
  padding: 12px 18px;
  border: 1px solid var(--cq-aq-border);
  border-radius: 20px;
  background: var(--cq-aq-bg);
  box-shadow: var(--cq-aq-shadow);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .18s ease, border-color .18s ease,
              box-shadow .18s ease, transform .12s ease;
}

.cq-aq__badge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 11px;
  background: var(--cq-aq-badge-bg);
  color: var(--cq-aq-badge-fg);
  font-family: "Space Grotesk", "Inter", system-ui, sans-serif;
  font-weight: 700;
  font-size: var(--cq-aq-badge-size);
  line-height: 1;
  transition: background-color .18s ease, color .18s ease;
}

.cq-aq__label {
  flex: 1;
  color: var(--cq-aq-label);
  font-size: 16px;
  font-weight: var(--cq-aq-label-weight);
  line-height: 1.35;
  text-wrap: pretty;
}

.cq-aq--selected {
  --cq-aq-bg: #2e2870;
  --cq-aq-border: #7c5cff;
  --cq-aq-shadow: 0 0 0 4px rgba(124, 92, 255, .16),
                  0 8px 22px rgba(124, 92, 255, .25);
  --cq-aq-badge-bg: #7c5cff;
  --cq-aq-badge-fg: #f5f3ff;
  --cq-aq-label-weight: 500;
}

.cq-aq--correct {
  --cq-aq-bg: #12351f;
  --cq-aq-border: #22c55e;
  --cq-aq-shadow: 0 0 0 4px rgba(34, 197, 94, .1);
  --cq-aq-badge-bg: #22c55e;
  --cq-aq-badge-fg: #08240f;
  --cq-aq-badge-size: 16px;
  --cq-aq-label: #eafbef;
  --cq-aq-label-weight: 500;
}

.cq-aq--wrong {
  --cq-aq-bg: #3a1620;
  --cq-aq-border: #ef4444;
  --cq-aq-shadow: 0 0 0 4px rgba(239, 68, 68, .14);
  --cq-aq-badge-bg: #ef4444;
  --cq-aq-badge-fg: #2b0a0f;
  --cq-aq-badge-size: 16px;
  --cq-aq-label: #ffefef;
  --cq-aq-label-weight: 500;
}

.cq-aq--muted {
  --cq-aq-bg: #211e47;
  --cq-aq-border: #2f2a5e;
  --cq-aq-badge-bg: #2a2555;
  --cq-aq-badge-fg: #6e689b;
  --cq-aq-label: #6e689b;
}

.cq-aq--correct.cq-aq--chosen {
  --cq-aq-shadow: 0 0 0 4px rgba(34, 197, 94, .14),
                  0 10px 26px rgba(34, 197, 94, .2);
}

.cq-aq--wrong.cq-aq--chosen {
  --cq-aq-shadow: 0 0 0 4px rgba(239, 68, 68, .14),
                  0 10px 26px rgba(239, 68, 68, .18);
}

.cq-aq:disabled {
  cursor: default;
}

.cq-aq--neutral:not(:disabled):hover {
  --cq-aq-bg: #2b2760;
  --cq-aq-border: #4b4680;
}

.cq-aq:not(:disabled):active {
  transform: scale(.985);
}

.cq-aq:focus-visible {
  outline: 2px solid #7c5cff;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .cq-aq,
  .cq-aq__badge {
    transition: none;
  }
  .cq-aq:not(:disabled):active {
    transform: none;
  }
}
`;

export function ButtonQuestion({
  label,
  letter,
  state = "neutral",
  chosen = false,
  ...rest
}: ButtonQuestionProps) {
  const revealed = state === "correct" || state === "wrong";
  const badge = BADGE_SYMBOL[state] ?? letter ?? "";

  const classes = ["cq-aq", STATE_CLASS[state]];
  if (chosen) classes.push("cq-aq--chosen");

  return (
    <>
      <style href="cq-button-question" precedence="medium">
        {CSS}
      </style>
      <button
        type="button"
        {...rest}
        className={classes.join(" ")}
        disabled={revealed || state === "muted"}
        aria-pressed={revealed || state === "muted" ? undefined : state === "selected"}
        aria-label={[letter && `${letter}.`, label, STATE_HINT[state]]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="cq-aq__badge" aria-hidden="true">
          {badge}
        </span>
        <span className="cq-aq__label">{label}</span>
      </button>
    </>
  );
}
