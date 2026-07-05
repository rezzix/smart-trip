from smart_trip.engine.models.room import Room
from smart_trip.engine.ports.room_repository import RoomRepository


class InMemoryRoomRepository(RoomRepository):
    def __init__(self):
        self._rooms: dict[str, Room] = {}

    def save(self, room: Room) -> None:
        self._rooms[room.id] = room

    def by_id(self, room_id: str) -> Room | None:
        return self._rooms.get(room_id)

    def delete(self, room_id: str) -> None:
        self._rooms.pop(room_id, None)
