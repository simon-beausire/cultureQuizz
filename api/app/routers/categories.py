import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_session
from ..models import Categorie, Question
from ..schemas import AnswerOut, CategorieOut, QuestionOut, QuizOut

router = APIRouter(prefix="/api/categories", tags=["categories"])

# Number of questions sent for one quiz.
QUESTIONS_PER_QUIZ = 10
# Number of answers shown per question: 1 correct + 3 wrong.
ANSWERS_PER_QUESTION = 4


def pick_answers(question: Question) -> list[AnswerOut]:
    """The correct answer plus 3 random wrong ones, shuffled.

    An answer id is its 1-based position in the stored list, so the same answer
    keeps the same id for a given question.
    """
    wrong_indexes = random.sample(range(1, len(question.answers)), ANSWERS_PER_QUESTION - 1)
    indexes = [0, *wrong_indexes]
    random.shuffle(indexes)

    return [
        AnswerOut(id=index + 1, text=question.answers[index], isCorrect=index == 0)
        for index in indexes
    ]


@router.get("", response_model=list[CategorieOut], summary="Lister les catégories")
def list_categories(session: Session = Depends(get_session)):
    return session.scalars(select(Categorie).order_by(Categorie.id)).all()


@router.get(
    "/{categorie_id}/questions",
    response_model=QuizOut,
    summary="10 questions au hasard dans une catégorie",
)
def questions(categorie_id: int, session: Session = Depends(get_session)):
    categorie = session.get(Categorie, categorie_id)
    if categorie is None:
        raise HTTPException(status_code=404, detail="Catégorie introuvable.")

    # ORDER BY RAND() is fine here: a few dozen rows per category
    tirage = session.scalars(
        select(Question)
        .where(Question.categorie_id == categorie.id)
        .order_by(func.rand())
        .limit(QUESTIONS_PER_QUIZ)
    ).all()

    return QuizOut(
        categorie=CategorieOut.model_validate(categorie),
        questions=[
            QuestionOut(id=q.id, question=q.question, answers=pick_answers(q)) for q in tirage
        ],
    )
