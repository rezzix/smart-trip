from abc import ABC, abstractmethod

from smart_trip.engine.models.room import Room


class RoomRepository(ABC):
    @abstractmethod
    def save(self, room: Room) -> None: ...

    @abstractmethod
    def by_id(self, room_id: str) -> Room | None: ...

    @abstractmethod
    def delete(self, room_id: str) -> None: ...
