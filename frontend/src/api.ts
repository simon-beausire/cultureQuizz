const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export type Categorie = {
  id: number;
  categorie: string;
  nbQuestions: number;
};

export type Answer = {
  id: string;
  text: string;
};

export type Question = {
  id: number;
  question: string;
  answers: Answer[];
};

export type Quiz = {
  categorie: Categorie;
  questions: Question[];
  nouveauCycle: boolean;
  jeton: string;
};

export type Verification = {
  correct: boolean;
  bonneReponseId: string;
};

class ApiError extends Error {}

const INJOIGNABLE = "API injoignable. Lance le back : « docker compose up -d ».";

async function messageHttp(reponse: Response): Promise<string> {
  const repli =
    reponse.status === 422
      ? "Cette catégorie n'existe pas."
      : `L'API a répondu ${reponse.status}.`;

  try {
    const corps: unknown = await reponse.json();
    const detail = (corps as { detail?: unknown }).detail;
    return typeof detail === "string" ? detail : repli;
  } catch {
    return repli;
  }
}

async function lire<T>(reponse: Response): Promise<T> {
  if (!reponse.ok) {
    throw new ApiError(await messageHttp(reponse));
  }
  return reponse.json() as Promise<T>;
}

async function get<T>(chemin: string): Promise<T> {
  let reponse: Response;

  try {
    reponse = await fetch(`${BASE}${chemin}`);
  } catch {
    throw new ApiError(INJOIGNABLE);
  }

  return lire<T>(reponse);
}

async function post<T>(chemin: string, corps: unknown): Promise<T> {
  let reponse: Response;

  try {
    reponse = await fetch(`${BASE}${chemin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
    });
  } catch {
    throw new ApiError(INJOIGNABLE);
  }

  return lire<T>(reponse);
}

export function getCategories() {
  return get<Categorie[]>("/categories");
}

export function getQuiz(categorieId: string | number, vues: number[] = []) {
  const parametres = vues.length ? `?vues=${vues.join(",")}` : "";
  return get<Quiz>(`/categories/${categorieId}/questions${parametres}`);
}

export function verifierReponse(jeton: string, questionId: number, answerId: string | null) {
  return post<Verification>("/answer", { jeton, questionId, answerId });
}

export function messageErreur(cause: unknown) {
  return cause instanceof ApiError ? cause.message : "Une erreur inattendue est survenue.";
}
