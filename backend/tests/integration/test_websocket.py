import pytest
from fastapi.testclient import TestClient

from smart_trip.main import app

client = TestClient(app)


def test_websocket_game_flow():
    create = client.post("/api/v1/games", json={"name": "Alice", "age": 12})
    game_id = create.json()["game_id"]
    alice_id = create.json()["player_id"]

    join = client.post(f"/api/v1/games/{game_id}/join", json={"name": "Bob", "age": 13})
    bob_id = join.json()["player_id"]

    with client.websocket_connect(f"/ws/game/{game_id}/{alice_id}") as alice_ws:
        msg = alice_ws.receive_json()
        assert msg["type"] == "player_joined"

        with client.websocket_connect(f"/ws/game/{game_id}/{bob_id}") as bob_ws:
            msg = bob_ws.receive_json()
            assert msg["type"] == "player_joined"

            msg = alice_ws.receive_json()
            assert msg["type"] == "player_joined"

            alice_ws.send_json({"type": "start_game", "payload": {}})

            for _ws in (alice_ws, bob_ws):
                msg = _ws.receive_json()
                assert msg["type"] == "game_started"

            while True:
                for _ws in (alice_ws, bob_ws):
                    msg = _ws.receive_json()
                    if msg["type"] == "round_end":
                        assert msg["payload"]["winner"] is not None
                        assert "final_scores" in msg["payload"]
                        return
                    assert msg["type"] in ("question", "question_result")

                alice_ws.send_json({
                    "type": "answer",
                    "payload": {"choice": 0},
                })
                bob_ws.send_json({
                    "type": "answer",
                    "payload": {"choice": 1},
                })
