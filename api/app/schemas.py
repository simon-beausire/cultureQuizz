from pydantic import BaseModel, ConfigDict


class CategorieOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categorie: str


class AnswerOut(BaseModel):
    id: int
    text: str
    # camelCase volontaire : c'est le nom que lit le front
    isCorrect: bool


class QuestionOut(BaseModel):
    id: int
    question: str
    answers: list[AnswerOut]


class QuizOut(BaseModel):
    categorie: CategorieOut
    questions: list[QuestionOut]
