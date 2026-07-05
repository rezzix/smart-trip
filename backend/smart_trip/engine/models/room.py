from enum import Enum

from pydantic import BaseModel

from smart_trip.engine.models.player import Player


class RoomStatus(str, Enum):
    WAITING = "waiting"
    PLAYING = "playing"
    FINISHED = "finished"


class Room(BaseModel):
    id: str
    host_id: str
    players: list[Player] = []
    status: RoomStatus = RoomStatus.WAITING
    age_range_min: int | None = None
    age_range_max: int | None = None
