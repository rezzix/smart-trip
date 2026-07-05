---
type: State/Section
title: Seeding & Test Data
description: Seed data for development and test fixtures for automated testing.
tags: [state, seeding, test-data, fixtures]
timestamp: 2026-07-04T00:00:00Z
---

# Seeding & Test Data

> **Note:** No seed data has been created yet. This document tracks the planned data structure for seeding and testing.

## Seed Data (Production / Development)

Located at `backend/data/`. Loaded on server start.

| File | Contents | Status |
|------|----------|--------|
| `cities.json` | 20 cities with name, country, coordinates, picture, difficulty, badge, facts, mini game pool, question pool, special ability, music | Not created |
| `questions/math.json` | ~50 math questions with min_age, max_age, difficulty, choices, answer, explanation, source | Not created |
| `questions/science.json` | ~50 science questions | Not created |
| `questions/history.json` | ~50 history questions | Not created |
| `questions/geography.json` | ~50 geography questions | Not created |
| `badges.json` | 5 badge definitions | Not created |
| `achievements.json` | 10 achievement definitions | Not created |
| `events.json` | 5 world events | Not created |
| `themes.json` | Theme configurations | Not created |

## Test Data (Tests)

Located at `tests/fixtures/` or inline in test files.

| Fixture | Purpose | Status |
|---------|---------|--------|
| Sample cities (3–5) | Engine tests with minimal world | Not created |
| Sample questions (all categories) | Question selection and age filtering tests | Not created |
| Sample badges | Badge award condition tests | Not created |
| Sample achievements | Achievement tracking tests | Not created |
| Sample mini game plugins | Plugin discovery and lifecycle tests | Not created |
| Sample player profiles | Player model and session tests | Not created |
| WebSocket message fixtures | Message serialization/deserialization tests | Not created |

## Question Data Format

```json
{
  "id": "math-001",
  "category": "math",
  "difficulty": "easy",
  "question": "What is 2 + 2?",
  "choices": ["3", "4", "5", "6"],
  "answer": "4",
  "explanation": "2 + 2 equals 4.",
  "source": "Grade 1 curriculum",
  "min_age": 6,
  "max_age": 99,
  "assets": []
}
```

## City Data Format

```json
{
  "id": "paris",
  "name": "Paris",
  "country": "France",
  "coordinates": { "lat": 48.8566, "lng": 2.3522 },
  "picture": "paris.png",
  "difficulty": "medium",
  "badge": "paris-explorer",
  "facts": ["Paris is the capital of France", "The Eiffel Tower was built in 1889"],
  "mini_game_pool": ["flag-quiz", "memory-match", "timeline"],
  "question_pool": ["math", "history"],
  "special_ability": "double-points-next-round",
  "music": "paris-theme.mp3"
}
```

## Example Themes

These are illustrative examples. Users can create any theme — the theme system is open-ended.

```json
[
  {
    "id": "european-capitals",
    "name": "European Capitals",
    "description": "Cities that are capitals of European countries",
    "color_scheme": { "primary": "#1a365d", "secondary": "#2b6cb0" },
    "icon": "europe.svg"
  },
  {
    "id": "ancient-wonders",
    "name": "Ancient Wonders",
    "description": "Historical cities with ancient landmarks",
    "color_scheme": { "primary": "#744210", "secondary": "#d69e2e" },
    "icon": "ancient.svg"
  },
  {
    "id": "coastal-cities",
    "name": "Coastal Cities",
    "description": "Cities on the coast with beach and port culture",
    "color_scheme": { "primary": "#2c5282", "secondary": "#38b2ac" },
    "icon": "coastal.svg"
  },
  {
    "id": "megacities",
    "name": "Megacities",
    "description": "Massive metropolitan centers with modern challenges",
    "color_scheme": { "primary": "#1a202c", "secondary": "#718096" },
    "icon": "megacity.svg"
  },
  {
    "id": "cultural-hubs",
    "name": "Cultural Hubs",
    "description": "Cities known for art, music, and cultural heritage",
    "color_scheme": { "primary": "#702459", "secondary": "#b83280" },
    "icon": "culture.svg"
  }
]
```
