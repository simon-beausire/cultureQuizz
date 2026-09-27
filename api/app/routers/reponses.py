from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_session
from ..models import Question
from ..schemas import VerificationIn, VerificationOut
from ..securite import jeton_reponse

router = APIRouter(prefix="/api", tags=["reponses"])


@router.post(
    "/answer",
    response_model=VerificationOut,
    summary="Dire si une réponse est la bonne, sans jamais l'avoir envoyée d'avance",
)
def verifier(demande: VerificationIn, session: Session = Depends(get_session)):
    question = session.get(Question, demande.questionId)
    if question is None:
        raise HTTPException(status_code=404, detail="Question introuvable.")

    jetons = [jeton_reponse(demande.jeton, question.id, i) for i in range(len(question.answers))]

    if demande.answerId is not None and demande.answerId not in jetons:
        raise HTTPException(
            status_code=409,
            detail="Cette partie n'est plus valide, relance-la.",
        )

    return VerificationOut(correct=demande.answerId == jetons[0], bonneReponseId=jetons[0])
