import hmac
import secrets
from hashlib import sha256

from .config import settings

LONGUEUR_JETON = 16


def jeton_tirage() -> str:
    return secrets.token_urlsafe(12)


def jeton_reponse(tirage: str, question_id: int, index: int) -> str:
    message = f"{tirage}:{question_id}:{index}".encode()
    signature = hmac.new(settings.secret_key.encode(), message, sha256)
    return signature.hexdigest()[:LONGUEUR_JETON]
