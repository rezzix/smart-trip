from fastapi import FastAPI

from smart_trip.api.routes.health import router as health_router
from smart_trip.config.settings import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
)

app.include_router(health_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Smart Trip — Online multiplayer educational game"}
