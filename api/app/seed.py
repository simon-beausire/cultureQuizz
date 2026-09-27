import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Categorie, Question

QUESTIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "questions.json"
ANSWERS_PER_QUESTION = 10


def seed(session: Session) -> int:
    payload = json.loads(QUESTIONS_FILE.read_text(encoding="utf-8"))

    categories = {c.categorie: c for c in session.scalars(select(Categorie))}
    deja_la = set(session.execute(select(Question.categorie_id, Question.question)).all())
    inserted = 0

    for bloc in payload["categories"]:
        categorie = categories.get(bloc["categorie"])
        if categorie is None:
            categorie = Categorie(categorie=bloc["categorie"])
            session.add(categorie)
            session.flush()
            categories[categorie.categorie] = categorie

        for item in bloc["questions"]:
            if (categorie.id, item["question"]) in deja_la:
                continue

            reponses = item["reponses"]
            if len(reponses) != ANSWERS_PER_QUESTION or len(set(reponses)) != ANSWERS_PER_QUESTION:
                raise ValueError(
                    f"La question « {item['question']} » doit avoir exactement "
                    f"{ANSWERS_PER_QUESTION} réponses différentes."
                )
            categorie.questions.append(Question(question=item["question"], answers=reponses))
            deja_la.add((categorie.id, item["question"]))
            inserted += 1

    session.commit()
    return inserted
