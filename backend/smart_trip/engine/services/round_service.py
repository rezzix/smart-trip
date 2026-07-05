import time

from smart_trip.engine.models.player import Player
from smart_trip.engine.models.question import Question
from smart_trip.engine.models.round import Round, RoundPhase


class RoundService:
    QUESTIONS_PER_ROUND_MIN = 3
    QUESTIONS_PER_ROUND_MAX = 5
    TIMER_SECONDS = 10

    def create_round(self, room_id: str, questions: list[Question]) -> Round:
        q_count = min(
            max(len(questions), self.QUESTIONS_PER_ROUND_MIN),
            self.QUESTIONS_PER_ROUND_MAX,
        )
        return Round(
            number=0,
            room_id=room_id,
            questions=questions[:q_count],
            timer_seconds=self.TIMER_SECONDS,
            question_started_at=time.time(),
        )

    def score_correct(self, _player: Player) -> int:
        return 1

    def score_incorrect(self, _player: Player) -> int:
        return 0

    def all_players_answered(self, round_state: Round, players: list[Player]) -> bool:
        return len(round_state.answers) >= len(players)

    def time_expired(self, round_state: Round) -> bool:
        elapsed = time.time() - round_state.question_started_at
        return elapsed >= round_state.timer_seconds
