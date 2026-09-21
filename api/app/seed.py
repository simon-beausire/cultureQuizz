import json
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Categorie, Question

QUESTIONS_FILE = Path(__file__).resolve().parent.parent / "data" / "questions.json"

# Chaque question stocke exactement ce nombre de réponses ; le quiz en affiche 4.
ANSWERS_PER_QUESTION = 10


def seed(session: Session) -> int:
    """Remplit la base à partir de data/questions.json.

    Ne fait rien si les questions sont déjà là : on peut donc l'appeler à chaque
    démarrage. Renvoie le nombre de questions insérées.
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
            # Ajouter via la relation remplit categorie_id tout seul
            categorie.questions.append(Question(question=item["question"], answers=reponses))
            inserted += 1

    session.commit()
    return inserted
