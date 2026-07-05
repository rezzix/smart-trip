---
type: State/Section
title: Quickstart
description: How to set up, start, and use the Smart Trip application.
tags: [state, quickstart, setup]
timestamp: 2026-07-04T00:00:00Z
---

# Quickstart

> **Note:** Scaffold milestone complete. Backend and frontend are ready for development.

## Prerequisites

- Python 3.13+
- Node.js 20+
- `uv` (Python package manager)
- `pnpm` or `npm` (Node.js package manager)

## Backend Setup

```bash
cd backend
uv sync
uv run uvicorn smart_trip.main:app --reload --port 8000
```

Server starts at `http://localhost:8000`. Health check: `GET http://localhost:8000/api/v1/health`.

## Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

App opens at `http://localhost:3000`.

## Running Tests

```bash
# All tests
cd backend
uv run pytest

# With coverage
uv run pytest --cov=smart_trip

# Specific test type
uv run pytest tests/unit/
uv run pytest tests/integration/
uv run pytest tests/simulation/
```

## Playing the Game

### Via Browser

1. Open `http://localhost:3000`
2. Enter a player name and age
3. Click **Create Game** or paste an invite link to **Join Game**
4. Share the invite URL with friends
5. Host clicks **Start** once 2+ players have joined
6. Play through rounds: choose a city, answer questions, play mini games
7. Complete the world tour to see final results

### Via WebSocket Tools (No Frontend)

```bash
# Connect to a game (requires a game ID from REST API)
websocat ws://localhost:8000/ws/game/{game_id}/{player_id}

# Or use Python directly
cd backend
uv run python tools/simulate_game.py --players 4 --rounds 3
```

## Project Commands

| Command | Description |
|---------|-------------|
| `uv run uvicorn ...` | Start backend server |
| `pnpm dev` | Start frontend dev server |
| `uv run pytest` | Run all backend tests |
| `uv run python tools/simulate_game.py` | Run headless game simulation |
| `uv run python tools/validate_data.py` | Validate JSON data files |
