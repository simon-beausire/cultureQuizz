import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_session
from ..models import Categorie, Question
from ..schemas import AnswerOut, CategorieOut, QuestionOut, QuizOut

router = APIRouter(prefix="/api/categories", tags=["categories"])

# Nombre de questions envoyées pour un quiz.
QUESTIONS_PER_QUIZ = 10
# Nombre de réponses affichées par question : 1 bonne + 3 mauvaises.
ANSWERS_PER_QUESTION = 4


def pick_answers(question: Question) -> list[AnswerOut]:
    """La bonne réponse plus 3 mauvaises au hasard, mélangées.

    L'id d'une réponse est sa position (à partir de 1) dans la liste stockée :
    une même réponse garde donc le même id pour une question donnée.
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

    # ORDER BY RAND() convient ici : quelques dizaines de lignes par catégorie
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
