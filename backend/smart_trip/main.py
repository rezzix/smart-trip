from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from smart_trip.api.routes.games import router as games_router
from smart_trip.api.routes.health import router as health_router
from smart_trip.api.websocket.handler import router as ws_router
from smart_trip.config.settings import settings
from smart_trip.engine.game import GameService
from smart_trip.engine.services.question_service import QuestionService
from smart_trip.repositories.memory.question_repo import InMemoryQuestionRepository
from smart_trip.repositories.memory.room_repo import InMemoryRoomRepository
from smart_trip.services.seed import load_seed_data

room_repo = InMemoryRoomRepository()
question_repo = InMemoryQuestionRepository()

load_seed_data(question_repo)

game_service = GameService(room_repo)
question_service = QuestionService(question_repo)

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(games_router, prefix="/api/v1")
app.include_router(ws_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Smart Trip — Online multiplayer educational game"}
