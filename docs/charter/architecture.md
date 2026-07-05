---
type: Charter/Section
title: Architecture
description: System architecture, engine design, and clean architecture layers for Smart Trip.
tags: [charter, architecture, design]
timestamp: 2026-07-04T00:00:00Z
---

# Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Next.js)              │
│  React · TypeScript · Zustand · TanStack Query  │
│  TailwindCSS · Framer Motion                    │
├─────────────────────┬───────────────────────────┤
│       REST          │       WebSockets           │
│  (create/join/      │  (gameplay, state,         │
│   leave/health)     │   real-time sync)          │
└──────────┬──────────┴──────────┬────────────────┘
           │                     │
           ▼                     ▼
┌─────────────────────────────────────────────────┐
│              FastAPI Game Server                 │
│         (game rules, state, timers)              │
├─────────────────────────────────────────────────┤
│           smart_trip_engine (core)               │
│  ┌──────────┬──────────┬──────────┬──────────┐  │
│  │  World   │  Cities  │  Mini    │  Event   │  │
│  │  Engine  │  Manager │  Games   │  System  │  │
│  ├──────────┼──────────┼──────────┼──────────┤  │
│  │ Question │  Player  │  Room    │  Reward  │  │
│  │  System  │  Manager │  Manager │  System  │  │
│  ├──────────┼──────────┼──────────┼──────────┤  │
│  │  Badge   │  Leader- │  Score   │  Shared  │  │
│  │  System  │  board   │  Engine  │  Challenge│  │
│  └──────────┴──────────┴──────────┴──────────┘  │
├─────────────────────────────────────────────────┤
│            Repository Interfaces                 │
│  (in-memory → SQLite → PostgreSQL → Redis)      │
└─────────────────────────────────────────────────┘
```

## Engine Architecture

- Create a dedicated `smart_trip_engine/` package in `backend/`.
- The engine must contain ALL gameplay logic.
- The engine must have zero dependency on React.
- The engine must be testable directly via pytest.
- FastAPI only exposes the engine to clients.

## The Engine Must Be Playable Without a Frontend

- Start the server, connect using WebSocket tools (Postman, websocat, etc.)
- Simulate players programmatically
- Run automated games
- Run pytest — all without React.

## Clean Architecture Layers

1. **Domain Layer** — Entities, value objects, game rules (zero dependencies)
2. **Application Layer** — Use cases, game orchestration, port interfaces
3. **Infrastructure Layer** — Repositories (in-memory → SQL), WebSocket adapters, REST controllers

## Key Architectural Decisions

- FastAPI IS the game server — it owns all game state, rules, timers.
- The frontend is a pure rendering client — it never decides game rules.
- Mini games use a plugin architecture with a common interface.
- Data is loaded from JSON files initially with repository interfaces for future database migration.
- WebSocket is the primary communication channel for gameplay; REST is limited to lobby operations.
