from enum import Enum

from pydantic import BaseModel

from smart_trip.engine.models.question import Question


class RoundPhase(str, Enum):
    QUESTION = "question"
    RESULTS = "results"
    FINISHED = "finished"


class Round(BaseModel):
    number: int
    room_id: str
    questions: list[Question]
    current_question_index: int = 0
    answers: dict[str, int | None] = {}
    phase: RoundPhase = RoundPhase.QUESTION
    timer_seconds: int = 10
    question_started_at: float = 0.0
