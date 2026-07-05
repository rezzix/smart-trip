from fastapi.testclient import TestClient

from smart_trip.main import app

client = TestClient(app)


def test_create_game():
    resp = client.post("/api/v1/games", json={"name": "Alice", "age": 12})
    assert resp.status_code == 200
    data = resp.json()
    assert "game_id" in data
    assert "player_id" in data
    assert "invite_url" in data


def test_create_and_join():
    create = client.post("/api/v1/games", json={"name": "Alice", "age": 12})
    game_id = create.json()["game_id"]

    join = client.post(f"/api/v1/games/{game_id}/join", json={"name": "Bob", "age": 13})
    assert join.status_code == 200
    assert join.json()["player_id"]


def test_join_nonexistent():
    resp = client.post("/api/v1/games/NONEXIST/join", json={"name": "Bob", "age": 13})
    assert resp.status_code == 404


def test_leave_game():
    create = client.post("/api/v1/games", json={"name": "Alice", "age": 12})
    data = create.json()
    game_id = data["game_id"]
    player_id = data["player_id"]

    resp = client.post(f"/api/v1/games/{game_id}/leave", json={"player_id": player_id})
    assert resp.status_code == 200
    assert resp.json()["success"] is True
