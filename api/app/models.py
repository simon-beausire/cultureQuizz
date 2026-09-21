from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Categorie(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    categorie: Mapped[str] = mapped_column(String(100), unique=True)

    questions: Mapped[list["Question"]] = relationship(
        back_populates="categorie_parente",
        cascade="all, delete-orphan",
    )


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    categorie_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), index=True
    )
    question: Mapped[str] = mapped_column(String(255))

    # Les 10 réponses, dans l'ordre. L'index 0 est TOUJOURS la bonne.
    answers: Mapped[list[str]] = mapped_column(JSON)

    categorie_parente: Mapped["Categorie"] = relationship(back_populates="questions")
