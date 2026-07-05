from smart_trip.engine.models.question import Question
from smart_trip.engine.ports.question_repository import QuestionRepository


class InMemoryQuestionRepository(QuestionRepository):
    def __init__(self, questions: list[Question] | None = None):
        self._questions = questions or []

    def all(self) -> list[Question]:
        return list(self._questions)

    def by_category(self, category: str) -> list[Question]:
        return [q for q in self._questions if q.category == category]

    def by_age_range(self, min_age: int, max_age: int) -> list[Question]:
        return [q for q in self._questions if q.min_age <= min_age and q.max_age >= max_age]
