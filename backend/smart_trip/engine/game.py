import random
import string

from smart_trip.engine.models.player import Player
from smart_trip.engine.models.room import Room, RoomStatus
from smart_trip.engine.models.round import Round, RoundPhase
from smart_trip.engine.ports.room_repository import RoomRepository

ID_LENGTH = 8


def _generate_id() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=ID_LENGTH))


class GameService:
    def __init__(self, room_repo: RoomRepository):
        self._room_repo = room_repo

    def create_room(self, host_name: str, host_age: int) -> Room:
        room_id = _generate_id()
        while self._room_repo.by_id(room_id) is not None:
            room_id = _generate_id()

        host = Player(id=_generate_id(), name=host_name, age=host_age)
        room = Room(id=room_id, host_id=host.id, players=[host])
        self._room_repo.save(room)
        return room

    def join_room(self, room_id: str, player_name: str, player_age: int) -> Player | None:
        room = self._room_repo.by_id(room_id)
        if room is None or room.status != RoomStatus.WAITING:
            return None

        player = Player(id=_generate_id(), name=player_name, age=player_age)
        room.players.append(player)
        self._room_repo.save(room)
        return player

    def leave_room(self, room_id: str, player_id: str) -> bool:
        room = self._room_repo.by_id(room_id)
        if room is None:
            return False

        room.players = [p for p in room.players if p.id != player_id]

        if not room.players:
            self._room_repo.delete(room_id)
            return True

        if room.host_id == player_id:
            room.host_id = room.players[0].id

        self._room_repo.save(room)
        return True

    def start_game(self, room_id: str, host_id: str) -> Room | None:
        room = self._room_repo.by_id(room_id)
        if room is None:
            return None
        if room.host_id != host_id:
            return None
        if len(room.players) < 2:
            return None

        room.status = RoomStatus.PLAYING
        self._room_repo.save(room)
        return room

    def get_room(self, room_id: str) -> Room | None:
        return self._room_repo.by_id(room_id)
