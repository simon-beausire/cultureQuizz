import json
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Categorie, Question

QUESTIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "questions.json"

# Every question stores exactly this many answers; the quiz then shows 4 of them.
ANSWERS_PER_QUESTION = 10


def seed(session: Session) -> int:
    """Fill the database from data/questions.json.

    Does nothing if questions are already there, so it is safe to run at every
    start-up. Returns the number of questions inserted.
    """
    if session.scalar(select(func.count()).select_from(Question)):
        return 0

    payload = json.loads(QUESTIONS_FILE.read_text(encoding="utf-8"))
    inserted = 0

    for bloc in payload["categories"]:
        categorie = Categorie(categorie=bloc["categorie"])
        session.add(categorie)

        for item in bloc["questions"]:
            reponses = item["reponses"]
            if len(reponses) != ANSWERS_PER_QUESTION or len(set(reponses)) != ANSWERS_PER_QUESTION:
                raise ValueError(
                    f"La question « {item['question']} » doit avoir exactement "
                    f"{ANSWERS_PER_QUESTION} réponses différentes."
                )
            # Appending to the relationship sets categorie_id for us
            categorie.questions.append(Question(question=item["question"], answers=reponses))
            inserted += 1

    session.commit()
    return inserted
