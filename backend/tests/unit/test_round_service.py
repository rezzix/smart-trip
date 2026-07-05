from smart_trip.engine.models.player import Player
from smart_trip.engine.models.question import Question
from smart_trip.engine.services.round_service import RoundService


def test_score_correct_gives_one_point():
    svc = RoundService()
    player = Player(id="p1", name="Alice", age=12)
    assert svc.score_correct(player) == 1


def test_score_incorrect_gives_zero():
    svc = RoundService()
    player = Player(id="p1", name="Alice", age=12)
    assert svc.score_incorrect(player) == 0


def test_create_round_sets_timer():
    svc = RoundService()
    questions = [
        Question(id="q1", category="Geo", difficulty="easy", text="Q", choices=["A", "B", "C", "D"], answer=0, explanation=""),
    ]
    r = svc.create_round("room1", questions)
    assert r.timer_seconds == 10
    assert len(r.questions) == 1
    assert r.question_started_at > 0
