from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from smart_trip.engine.game import GameService

router = APIRouter()


class CreateGameRequest(BaseModel):
    name: str
    age: int


class JoinGameRequest(BaseModel):
    name: str
    age: int


class LeaveGameRequest(BaseModel):
    player_id: str


def _get_game_service() -> GameService:
    from smart_trip.main import game_service
    return game_service


@router.post("/games")
async def create_game(body: CreateGameRequest):
    service = _get_game_service()
    room = service.create_room(body.name, body.age)
    return {
        "game_id": room.id,
        "invite_url": f"/game/{room.id}",
        "player_id": room.players[0].id,
    }


@router.post("/games/{game_id}/join")
async def join_game(game_id: str, body: JoinGameRequest):
    service = _get_game_service()
    player = service.join_room(game_id, body.name, body.age)
    if player is None:
        raise HTTPException(status_code=404, detail="Game not found or already started")
    return {"player_id": player.id, "game_id": game_id}


@router.post("/games/{game_id}/leave")
async def leave_game(game_id: str, body: LeaveGameRequest):
    service = _get_game_service()
    ok = service.leave_room(game_id, body.player_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"success": True}
