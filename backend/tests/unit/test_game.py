import pytest

from smart_trip.engine.game import GameService
from smart_trip.engine.models.room import RoomStatus
from smart_trip.repositories.memory.room_repo import InMemoryRoomRepository


@pytest.fixture
def game():
    return GameService(InMemoryRoomRepository())


def test_create_room(game):
    room = game.create_room("Alice", 12)
    assert room.id
    assert len(room.players) == 1
    assert room.players[0].name == "Alice"
    assert room.status == RoomStatus.WAITING


def test_join_room(game):
    room = game.create_room("Alice", 12)
    player = game.join_room(room.id, "Bob", 13)
    assert player is not None
    assert player.name == "Bob"
    updated = game.get_room(room.id)
    assert updated is not None
    assert len(updated.players) == 2


def test_join_room_fails_when_game_started(game):
    room = game.create_room("Alice", 12)
    result = game.start_game(room.id, room.players[0].id)
    assert result is not None
    player = game.join_room(room.id, "Bob", 13)
    assert player is None


def test_start_game_requires_host(game):
    room = game.create_room("Alice", 12)
    result = game.start_game(room.id, "wrong-id")
    assert result is None


def test_start_game_succeeds_alone(game):
    room = game.create_room("Alice", 12)
    result = game.start_game(room.id, room.players[0].id)
    assert result is not None
    assert result.status == RoomStatus.PLAYING


def test_start_game_succeeds_with_two(game):
    room = game.create_room("Alice", 12)
    game.join_room(room.id, "Bob", 13)
    result = game.start_game(room.id, room.players[0].id)
    assert result is not None
    assert result.status == RoomStatus.PLAYING


def test_leave_room_transfers_host(game):
    room = game.create_room("Alice", 12)
    alice_id = room.players[0].id
    game.join_room(room.id, "Bob", 13)
    assert game.leave_room(room.id, alice_id) is True
    updated = game.get_room(room.id)
    assert updated is not None
    assert updated.host_id != alice_id
    assert len(updated.players) == 1


def test_leave_room_deletes_if_empty(game):
    room = game.create_room("Alice", 12)
    alice_id = room.players[0].id
    game.leave_room(room.id, alice_id)
    assert game.get_room(room.id) is None
