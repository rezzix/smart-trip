from abc import ABC, abstractmethod

from smart_trip.engine.models.question import Question


class QuestionRepository(ABC):
    @abstractmethod
    def all(self) -> list[Question]: ...

    @abstractmethod
    def by_category(self, category: str) -> list[Question]: ...

    @abstractmethod
    def by_age_range(self, min_age: int, max_age: int) -> list[Question]: ...
