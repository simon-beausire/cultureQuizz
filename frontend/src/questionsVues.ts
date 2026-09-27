const CLE = "cultureQuizz.questionsVues";

type Memoire = Record<string, number[]>;

function lireTout(): Memoire {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return {};

    const valeur: unknown = JSON.parse(brut);
    if (typeof valeur !== "object" || valeur === null) return {};

    return Object.fromEntries(
      Object.entries(valeur as Record<string, unknown>)
        .filter(([, ids]) => Array.isArray(ids))
        .map(([categorie, ids]) => [
          categorie,
          (ids as unknown[]).filter((id): id is number => Number.isInteger(id)),
        ]),
    );
  } catch {
    return {};
  }
}

function ecrireTout(memoire: Memoire) {
  try {
    localStorage.setItem(CLE, JSON.stringify(memoire));
  } catch {
    return;
  }
}

export function questionsVues(categorieId: string): number[] {
  return lireTout()[categorieId] ?? [];
}

export function noterQuestionsVues(
  categorieId: string,
  ids: number[],
  nouveauCycle: boolean,
) {
  const memoire = lireTout();
  const connues = nouveauCycle ? [] : (memoire[categorieId] ?? []);

  memoire[categorieId] = [...new Set([...connues, ...ids])];
  ecrireTout(memoire);
}
