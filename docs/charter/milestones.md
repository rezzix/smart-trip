---
type: Charter/Section
title: Milestones
description: Defined project milestones from scaffold through incremental releases.
tags: [charter, milestones, planning]
timestamp: 2026-07-04T00:00:00Z
---

# Milestones

## Scaffold

A first technical version with application dependencies loaded and ability to launch the application without errors and with a minimal welcome page/message.

**Goal:** Verify the full toolchain compiles, dependencies resolve, and both backend and frontend start cleanly.

| Area | Deliverable |
|------|-------------|
| Backend | FastAPI project boots, health endpoint responds, `uv` lockfile committed |
| Frontend | Next.js app renders a welcome page, connects to dev server |
| Tests | pytest runs with at least one passing test |
| CI | Basic lint/type-check passes |

## POC (Proof of Concept)

A version of the application with at least core functionality working and testable.

**Goal:** A single round of gameplay is demonstrable — lobby, city selection, questions, scoring — with virtual players over WebSocket.

**Game flow (simplified for POC):** Lobby → Question → Question → Question (3–5) → Results → Next Round. Travel animation, mini games, and shared challenges are skipped for POC.

**Question timer:** 10 seconds per question. Unanswered questions score 0.

| Area | Deliverable |
|------|-------------|
| Engine | Core round lifecycle, question loading and selection (3–5 per round), 10s timer, basic scoring (1 point per correct answer) |
| API | REST create/join/leave, WebSocket game loop with typed messages |
| Repositories | In-memory implementation for all entities |
| Frontend | Minimal UI for lobby (name + age + create/join), question screen (timer + 4 choices), results screen (scores) |
| Tests | Unit tests for engine, integration tests for API (REST + WebSocket), one game simulation test with 2+ virtual players |
| Data | Seed JSON for 5 cities, 20 questions (one category, e.g. Geography), 2 badges |

## MVP (Minimum Viable Product)

An extended version with main functionality working and design elements all in place.

**Goal:** Complete, playable game with all round phases, mini games, world travel, badges, and a polished frontend.

| Area | Deliverable |
|------|-------------|
| Engine | World travel, mini game plugin interface, badge/achievement system, leaderboard, shared challenges, events |
| API | Full WebSocket message set, host controls (kick, settings) |
| Repositories | Persistence layer ready for SQLite migration |
| Frontend | All screens implemented: world map, travel, mini game, shared challenge, results, end game. Polished UI with animations |
| Tests | Full test suite for all engine modules, simulation tests for N players |
| Data | 20 cities, 200 questions (4 categories), 5 badges, 10 achievements, 5 mini games, 5 events, 5 shared challenge types |

## V1.1

Incremental release with improvements and fixes.

| Area | Focus |
|------|-------|
| Engine | Bug fixes, balance tuning, edge cases |
| API | Performance optimization, error handling hardening |
| Frontend | UX polish, accessibility pass, responsive layout |
| Data | Additional questions, cities, badges, themes |

## V1.2

Incremental release with improvements and fixes.

| Area | Focus |
|------|-------|
| Persistence | SQLite migration, repository swap |
| Community | Contribution documentation, plugin SDK examples |
| Content | Localization support, additional categories |
| Tooling | Question generator, city validator, game simulator CLI |

## V1.3

Incremental release with improvements and fixes.

| Area | Focus |
|------|-------|
| Infrastructure | PostgreSQL + Redis support, deployment scripts |
| Scale | Load testing, connection pooling, horizontal scaling |
| Community | Level 1 and Level 2 contribution workflows documented and tested |
| Quality | Performance benchmarks, monitoring, analytics |
