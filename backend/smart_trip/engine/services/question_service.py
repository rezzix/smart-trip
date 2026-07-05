import random

from smart_trip.engine.models.question import Question
from smart_trip.engine.ports.question_repository import QuestionRepository


class QuestionService:
    def __init__(self, question_repo: QuestionRepository):
        self._repo = question_repo

    def select_for_round(
        self, count: int, player_ages: list[int], category: str | None = None
    ) -> list[Question]:
        if category:
            pool = self._repo.by_category(category)
        else:
            pool = self._repo.all()

        if player_ages:
            min_age = min(player_ages)
            max_age = max(player_ages)
            pool = [q for q in pool if q.min_age <= min_age and q.max_age >= max_age]

        if len(pool) <= count:
            return list(pool)

        return random.sample(pool, count)
