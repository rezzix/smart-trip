import json
import time

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from smart_trip.api.websocket.manager import ConnectionManager
from smart_trip.api.websocket.messages import ClientMessage
from smart_trip.engine.game import GameService
from smart_trip.engine.models.room import RoomStatus
from smart_trip.engine.services.question_service import QuestionService
from smart_trip.engine.services.round_service import RoundService

router = APIRouter()
manager = ConnectionManager()


def _get_game_service() -> GameService:
    from smart_trip.main import game_service
    return game_service


def _get_question_service() -> QuestionService:
    from smart_trip.main import question_service
    return question_service


@router.websocket("/ws/game/{game_id}/{player_id}")
async def game_websocket(ws: WebSocket, game_id: str, player_id: str):
    await ws.accept()
    manager.connect(game_id, ws)

    game_service = _get_game_service()
    question_service = _get_question_service()
    round_service = RoundService()

    try:
        room = game_service.get_room(game_id)
        if room is None:
            await ws.send_json({"type": "error", "payload": {"code": "GAME_NOT_FOUND"}})
            await ws.close()
            return

        player = next((p for p in room.players if p.id == player_id), None)
        if player is None:
            await ws.send_json({"type": "error", "payload": {"code": "PLAYER_NOT_FOUND"}})
            await ws.close()
            return

        await manager.broadcast(game_id, {
            "type": "player_joined",
            "payload": {"player_id": player.id, "name": player.name},
        })

        while True:
            raw = await ws.receive_text()
            data = json.loads(raw)
            msg = ClientMessage(**data)

            if msg.type == "start_game":
                room = game_service.start_game(game_id, player_id)
                if room is None:
                    await ws.send_json({
                        "type": "error",
                        "payload": {"code": "NOT_HOST_OR_TOO_FEW"},
                    })
                    continue

                ages = [p.age for p in room.players]
                questions = question_service.select_for_round(
                    count=round_service.QUESTIONS_PER_ROUND_MAX,
                    player_ages=ages,
                )
                current_round = round_service.create_round(game_id, questions)
                manager.set_round(game_id, current_round)

                await manager.broadcast(game_id, {
                    "type": "game_started",
                    "payload": {
                        "room_id": room.id,
                        "players": [{"id": p.id, "name": p.name, "score": p.score} for p in room.players],
                    },
                })

                await _send_question(manager, game_id, round_service)

            elif msg.type == "answer":
                room = game_service.get_room(game_id)
                if room is None or room.status == RoomStatus.FINISHED:
                    continue

                current_round = manager.get_round(game_id)
                if current_round is None:
                    continue

                choice = msg.payload.get("choice")

                if player_id not in current_round.answers:
                    current_round.answers[player_id] = choice

                    all_answered = round_service.all_players_answered(current_round, room.players)
                    timed_out = round_service.time_expired(current_round)

                    if all_answered or timed_out:
                        await _send_results(manager, game_id, round_service, room.players)
                        current_round.current_question_index += 1
                        if current_round.current_question_index < len(current_round.questions):
                            current_round.answers = {}
                            current_round.question_started_at = time.time()
                            await _send_question(manager, game_id, round_service)
                        else:
                            await _send_round_end(manager, game_id, room.players)
                            room.status = RoomStatus.FINISHED
                            game_service._room_repo.save(room)

    except WebSocketDisconnect:
        manager.disconnect(game_id, ws)
        await manager.broadcast(game_id, {
            "type": "player_left",
            "payload": {"player_id": player_id},
        })


async def _send_question(manager: ConnectionManager, game_id: str, round_service: RoundService):
    current_round = manager.get_round(game_id)
    if current_round is None:
        return
    q = current_round.questions[current_round.current_question_index]
    await manager.broadcast(game_id, {
        "type": "question",
        "payload": {
            "question_index": current_round.current_question_index,
            "total": len(current_round.questions),
            "text": q.text,
            "choices": q.choices,
            "time_remaining": round_service.TIMER_SECONDS,
        },
    })


async def _send_results(manager: ConnectionManager, game_id: str, round_service: RoundService, players):
    current_round = manager.get_round(game_id)
    if current_round is None:
        return
    q = current_round.questions[current_round.current_question_index]
    correct = q.answer
    results = []
    for p in players:
        choice = current_round.answers.get(p.id)
        if choice == correct:
            p.score += round_service.score_correct(p)
        results.append({
            "player_id": p.id,
            "name": p.name,
            "choice": choice,
            "correct": choice == correct,
            "score": p.score,
        })

    await manager.broadcast(game_id, {
        "type": "question_result",
        "payload": {
            "correct_answer": correct,
            "explanation": q.explanation,
            "results": results,
        },
    })


async def _send_round_end(manager: ConnectionManager, game_id: str, players):
    if not players:
        return
    sorted_ps = sorted(players, key=lambda p: p.score, reverse=True)
    top_score = sorted_ps[0].score
    tied = [p for p in sorted_ps if p.score == top_score]
    if len(tied) > 1:
        winner = "Tie"
    else:
        winner = tied[0].name
    await manager.broadcast(game_id, {
        "type": "round_end",
        "payload": {
            "final_scores": [
                {"player_id": p.id, "name": p.name, "score": p.score}
                for p in sorted_ps
            ],
            "winner": winner,
            "is_tie": len(tied) > 1,
        },
    })
