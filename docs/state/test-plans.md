---
type: State/Section
title: Test Plans
description: Test plans per module, covering unit, integration, WebSocket, and simulation tests.
tags: [state, testing, test-plans]
timestamp: 2026-07-04T00:00:00Z
---

# Test Plans

> **Note:** This document tracks test coverage per module.

## Test Infrastructure

| Item | Status |
|------|--------|
| pytest configured | Done |
| Playwright e2e | Done |
| PlayerSimulator utility | Not started |
| Test fixtures | Not started |
| CI test runner | Not started |

## E2E Tests

| Test | File | Status |
|------|------|--------|
| Welcome page renders with title and buttons | `frontend/e2e/scaffold.spec.ts` | Done — 2 passed (1.0s) |
| Backend health endpoint | `frontend/e2e/scaffold.spec.ts` | Done |

Video: `docs/e2e/videos/scaffold-welcome-page.webm`

## Per-Module Test Plans

### `smart_trip_engine/`

| Sub-module | Unit Tests | Integration Tests | Notes |
|------------|-----------|-------------------|-------|
| `world/` | Planned | Planned | Route generation, graph traversal, city dedup |
| `cities/` | Planned | Planned | City data loading, registry, discovery |
| `rooms/` | Planned | Planned | Room lifecycle, host transfer, age filter enforcement |
| `players/` | Planned | — | Player model, session state |
| `questions/` | Planned | Planned | Selection algorithm, age filtering, validation |
| `mini_games/` | Planned | Planned | Plugin discovery, interface contract, lifecycle |
| `events/` | Planned | Planned | Event triggers, effects, timing |
| `badges/` | Planned | — | Award conditions, badge registry |
| `achievements/` | Planned | — | Achievement tracking, conditions |
| `scoring/` | Planned | Planned | Score calculation, multipliers, combos |
| `leaderboards/` | Planned | Planned | Ranking, ties, persistence |
| `rewards/` | Planned | — | Distribution logic |
| `shared_challenges/` | Planned | Planned | Challenge resolution |
| `rounds/` | Planned | Planned | Phase transitions, timers |

### `api/`

| Sub-module | Unit Tests | Integration Tests | Notes |
|------------|-----------|-------------------|-------|
| `routes/` | Planned | Planned | REST endpoint behavior |
| `websocket/` | Planned | Planned | Message routing, connection lifecycle |
| `dependencies/` | Planned | — | DI container setup |
| `middleware/` | Planned | — | Error handling, logging |

### `repositories/`

| Sub-module | Unit Tests | Integration Tests | Notes |
|------------|-----------|-------------------|-------|
| `interfaces/` | Planned | — | Interface contract tests |
| `memory/` | — | Planned | In-memory impl doubles as test double |
| `sqlite/` | — | Planned | Phase 2 |
| `postgres/` | — | Planned | Phase 3 |
| `redis/` | — | Planned | Phase 3 |

### Simulation Tests

| Scenario | Status |
|----------|--------|
| Full game from lobby to completion | Planned |
| Minimum player count (2) | Planned |
| Maximum player count | Planned |
| Player disconnect mid-game | Planned |
| Simultaneous answers from all players | Planned |
| Host leaving and transfer | Planned |
| Age filter enforcement | Planned |

## Coverage Goals

- Engine package: 90%+ line coverage
- FastAPI routes: 80%+ line coverage
- Critical paths (lobby → gameplay → results): 100%
