---
type: Charter/Section
title: Modules & Sub-modules
description: Detailed module specification, project structure breakdown, and high-level analysis for Smart Trip.
tags: [charter, modules, structure]
timestamp: 2026-07-04T00:00:00Z
---

# Modules & Sub-modules

## Project Top-Level Structure

```
smart-trip/
├── backend/           # Python FastAPI game server
├── frontend/          # Next.js React application
├── OKF/               # Open Knowledge Format knowledge base
├── docs/              # Documentation
├── tests/             # Test suites (mirrors backend structure)
├── assets/            # Game assets
├── tools/             # Developer utilities
└── scripts/           # Automation scripts
```

## Backend Modules (`backend/`)

### `smart_trip_engine/` — Core Game Engine

The engine contains ALL gameplay logic with zero framework dependencies.

| Sub-module | Responsibility |
|------------|---------------|
| `world/` | World map, city graph, route generation, travel mechanics |
| `cities/` | City data model, city registry, city discovery |
| `rooms/` | Room/lobby lifecycle, player management, host transfer, age range filter enforcement |
| `players/` | Player model, session management, state tracking |
| `questions/` | Question loading, selection, validation, category filtering, age-based filtering |
| `mini_games/` | Plugin interface, mini game registry, game lifecycle |
| `events/` | World events system, event triggers, effects |
| `badges/` | Badge definitions, award conditions, player badges |
| `achievements/` | Achievement definitions, tracking, rewards |
| `scoring/` | Score calculation, multipliers, combo systems |
| `leaderboards/` | Round and game leaderboards |
| `rewards/` | Reward distribution, currency, inventory |
| `shared_challenges/` | Group challenge types and resolution |
| `rounds/` | Round lifecycle, phase transitions, timers |

**Analysis:** The engine is the heart of the project. It must be fully testable without FastAPI or React. The plugin architecture for mini games makes this the primary extensibility point for Level 2+ contributors. The domain model is rich with value objects (City, Question, Player, Badge, etc.) and aggregate roots (Game, Room, Round).

### `api/` — FastAPI Interface

| Sub-module | Responsibility |
|------------|---------------|
| `routes/` | REST endpoints (create/join/leave/health) |
| `websocket/` | WebSocket connection manager, message routing |
| `dependencies/` | FastAPI dependency injection |
| `middleware/` | Error handling, logging, CORS |

**Analysis:** Thin layer. REST is only for lobby operations; WebSocket handles everything else. Every message type must be a strongly typed Pydantic model.

### `repositories/` — Data Access Layer

| Sub-module | Responsibility |
|------------|---------------|
| `interfaces/` | Abstract repository interfaces |
| `memory/` | In-memory implementations (MVP) |
| `sqlite/` | SQLite implementations (Phase 2) |
| `postgres/` | PostgreSQL implementations (Phase 3) |
| `redis/` | Redis cache/live game state (Phase 3) |

**Analysis:** The repository pattern is critical for the persistence evolution strategy. Interfaces defined here must be stable because they are the contract the engine depends on. The in-memory implementation doubles as the test double.

### `models/` — Domain Models

- Pydantic models for all game entities and value objects (including `min_age` and `max_age` on Question for age-based filtering)
- WebSocket message schemas
- Request/response schemas (including age range in game creation)
- Configuration models

### `config/` — Configuration

- Settings loading from YAML/JSON
- Environment variable handling
- Game balance tuning parameters

### `data/` — Game Content Data (JSON)

```
backend/data/
├── cities.json           # 20 initial cities
├── questions/            # 200 questions in category subdirectories
│   ├── math.json
│   ├── science.json
│   ├── history.json
│   └── geography.json
├── badges.json           # 5 badges
├── achievements.json     # 10 achievements
├── events.json           # 5 world events
└── themes.json           # Example theme configurations (users can add any theme)
```

## Frontend Modules (`frontend/`)

### Pages & Routes (Next.js App Router)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `LandingPage` | Name + age input, create/join |
| `/game/[id]` | `GamePage` | Main game container (lobby + gameplay) |

### State Management (Zustand)

| Store | Responsibility |
|-------|---------------|
| `useGameStore` | Game state, round, phase, current screen |
| `usePlayerStore` | Local player info, connected players |
| `useWebSocketStore` | WebSocket connection, message queue |

### UI Component Categories

| Layer | Components | Framework |
|-------|-----------|-----------|
| **Layout** | GameContainer, Screen transitions | React + Framer Motion |
| **Lobby** | PlayerList, GameSettings, InviteLink | React + TailwindCSS |
| **Map** | WorldMap, CityMarker, RouteLine | React + SVG |
| **Gameplay** | CityCard, QuestionCard, Timer, MiniGameContainer | React |
| **Results** | ScoreBoard, BadgeDisplay, Leaderboard | React + TailwindCSS |
| **Shared** | Button, Input, Modal, LoadingSpinner | React + TailwindCSS |

## OKF Module (`OKF/`)

Knowledge base in Open Knowledge Format documenting the project's design decisions, API references, and operational knowledge.

## Assets Module (`assets/`)

```
assets/
├── images/png/        # City pictures, badges, UI elements
├── images/svg/        # Icons, map markers, logos
└── audio/mp3/         # Background music, sound effects
```

## Tools Module (`tools/`)

- Game simulation runner
- Question data generator
- City data validator
- Localization tooling

## Scripts Module (`scripts/`)

- Database migration scripts
- Content import/export
- CI/CD scripts
- Development setup
