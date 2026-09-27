import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_session
from ..models import Categorie, Question
from ..schemas import AnswerOut, CategorieOut, QuestionOut, QuizOut
from ..securite import jeton_reponse, jeton_tirage

router = APIRouter(prefix="/api/categories", tags=["categories"])

QUESTIONS_PER_QUIZ = 10
ANSWERS_PER_QUESTION = 4


def pick_answers(question: Question, tirage: str) -> list[AnswerOut]:
    wrong_indexes = random.sample(range(1, len(question.answers)), ANSWERS_PER_QUESTION - 1)
    indexes = [0, *wrong_indexes]
    random.shuffle(indexes)

    return [
        AnswerOut(id=jeton_reponse(tirage, question.id, index), text=question.answers[index])
        for index in indexes
    ]


def parse_ids(brut: str) -> set[int]:
    return {int(morceau) for morceau in brut.split(",") if morceau.strip().isdigit()}


def tirer(session: Session, categorie_id: int, sauf: set[int], combien: int) -> list[Question]:
    if combien <= 0:
        return []

    requete = select(Question).where(Question.categorie_id == categorie_id)
    if sauf:
        requete = requete.where(Question.id.notin_(sauf))

    return list(session.scalars(requete.order_by(func.rand()).limit(combien)))


def compter_questions(session: Session, categorie_id: int) -> int:
    return session.scalar(
        select(func.count()).select_from(Question).where(Question.categorie_id == categorie_id)
    )


@router.get("", response_model=list[CategorieOut], summary="Lister les catégories")
def list_categories(session: Session = Depends(get_session)):
    lignes = session.execute(
        select(Categorie.id, Categorie.categorie, func.count(Question.id))
        .outerjoin(Question, Question.categorie_id == Categorie.id)
        .group_by(Categorie.id, Categorie.categorie)
        .order_by(Categorie.id)
    ).all()

    return [CategorieOut(id=id_, categorie=nom, nbQuestions=total) for id_, nom, total in lignes]


@router.get(
    "/{categorie_id}/questions",
    response_model=QuizOut,
    summary="10 questions au hasard dans une catégorie, hors celles déjà vues",
)
def questions(categorie_id: int, vues: str = "", session: Session = Depends(get_session)):
    categorie = session.get(Categorie, categorie_id)
    if categorie is None:
        raise HTTPException(status_code=404, detail="Catégorie introuvable.")

    tirage = tirer(session, categorie.id, parse_ids(vues), QUESTIONS_PER_QUIZ)
    nouveau_cycle = len(tirage) < QUESTIONS_PER_QUIZ

    if nouveau_cycle:
        tirage += tirer(
            session,
            categorie.id,
            {q.id for q in tirage},
            QUESTIONS_PER_QUIZ - len(tirage),
        )
        random.shuffle(tirage)

    tirage_id = jeton_tirage()

    return QuizOut(
        categorie=CategorieOut(
            id=categorie.id,
            categorie=categorie.categorie,
            nbQuestions=compter_questions(session, categorie.id),
        ),
        questions=[
            QuestionOut(id=q.id, question=q.question, answers=pick_answers(q, tirage_id))
            for q in tirage
        ],
        nouveauCycle=nouveau_cycle,
        jeton=tirage_id,
    )
