from fastapi import WebSocket

from smart_trip.engine.models.round import Round


class ConnectionManager:
    def __init__(self):
        self._connections: dict[str, list[WebSocket]] = {}
        self._rounds: dict[str, Round] = {}

    def connect(self, room_id: str, ws: WebSocket) -> None:
        if room_id not in self._connections:
            self._connections[room_id] = []
        self._connections[room_id].append(ws)

    def disconnect(self, room_id: str, ws: WebSocket) -> None:
        if room_id in self._connections:
            self._connections[room_id] = [c for c in self._connections[room_id] if c != ws]
            if not self._connections[room_id]:
                del self._connections[room_id]
                self._rounds.pop(room_id, None)

    def set_round(self, room_id: str, current_round: Round) -> None:
        self._rounds[room_id] = current_round

    def get_round(self, room_id: str) -> Round | None:
        return self._rounds.get(room_id)

    async def broadcast(self, room_id: str, message: dict) -> None:
        for ws in self._connections.get(room_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                pass
