from pydantic import BaseModel, ConfigDict


class CategorieOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categorie: str
    nbQuestions: int


class AnswerOut(BaseModel):
    id: str
    text: str


class QuestionOut(BaseModel):
    id: int
    question: str
    answers: list[AnswerOut]


class QuizOut(BaseModel):
    categorie: CategorieOut
    questions: list[QuestionOut]
    nouveauCycle: bool
    jeton: str


class VerificationIn(BaseModel):
    jeton: str
    questionId: int
    answerId: str | None = None


class VerificationOut(BaseModel):
    correct: bool
    bonneReponseId: str
