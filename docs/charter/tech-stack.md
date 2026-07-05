---
type: Charter/Section
title: Technology Stack
description: Complete technology stack for Smart Trip backend, frontend, tooling, and assets.
tags: [charter, tech-stack, backend, frontend]
timestamp: 2026-07-04T00:00:00Z
---

# Technology Stack

## Backend

| Technology | Purpose |
|------------|---------|
| **Python 3.13** | Runtime |
| **FastAPI** | Game server (REST + WebSocket) |
| **Pydantic** | Data validation and typed message models |
| **pytest** | Testing framework |
| **uv** | Python package/project manager |

## Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework |
| **React** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **TailwindCSS** | Utility-first CSS |
| **Zustand** | Client state management |
| **TanStack Query** | Server state and data fetching |
| **Framer Motion** | Animations and transitions |

## Configuration & Data

| Format | Usage |
|--------|-------|
| **YAML** | Configuration files |
| **JSON** | Game content data (cities, questions, badges, etc.) |

## Assets

| Format | Usage |
|--------|-------|
| **PNG** | Images, sprites |
| **SVG** | Icons, vector graphics |
| **MP3** | Music, sound effects |

## Data Storage (Evolution)

| Phase | Technology |
|-------|-----------|
| MVP | In-memory Python objects + JSON files |
| Phase 2 | SQLite |
| Phase 3 | PostgreSQL + Redis |

## Development Tools

| Tool | Purpose |
|------|---------|
| **uv** | Python dependency and project management |
| **Git** | Version control |
| **pytest** | Backend testing |
| **Postman / websocat** | Manual WebSocket testing |
