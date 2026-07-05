from smart_trip.engine.models.question import Question
from smart_trip.engine.services.question_service import QuestionService
from smart_trip.repositories.memory.question_repo import InMemoryQuestionRepository


def test_select_questions_filters_by_age():
    questions = [
        Question(id="q1", category="Geo", difficulty="easy", text="Q1", choices=["A", "B", "C", "D"], answer=0, explanation="", min_age=6, max_age=10),
        Question(id="q2", category="Geo", difficulty="easy", text="Q2", choices=["A", "B", "C", "D"], answer=0, explanation="", min_age=11, max_age=99),
    ]
    repo = InMemoryQuestionRepository(questions)
    svc = QuestionService(repo)

    result = svc.select_for_round(5, player_ages=[8])
    assert len(result) == 1
    assert result[0].id == "q1"


def test_select_questions_returns_all_if_pool_small():
    questions = [
        Question(id="q1", category="Geo", difficulty="easy", text="Q1", choices=["A", "B", "C", "D"], answer=0, explanation=""),
        Question(id="q2", category="Geo", difficulty="easy", text="Q2", choices=["A", "B", "C", "D"], answer=0, explanation=""),
    ]
    repo = InMemoryQuestionRepository(questions)
    svc = QuestionService(repo)

    result = svc.select_for_round(5, player_ages=[])
    assert len(result) == 2


def test_select_questions_filters_by_category():
    questions = [
        Question(id="q1", category="Math", difficulty="easy", text="Q1", choices=["A", "B", "C", "D"], answer=0, explanation=""),
        Question(id="q2", category="Geo", difficulty="easy", text="Q2", choices=["A", "B", "C", "D"], answer=0, explanation=""),
    ]
    repo = InMemoryQuestionRepository(questions)
    svc = QuestionService(repo)

    result = svc.select_for_round(5, player_ages=[], category="Math")
    assert len(result) == 1
    assert result[0].id == "q1"
