---
type: Charter/Section
title: Business Rules
description: Core game rules, lobby mechanics, progression, and winning conditions for Smart Trip.
tags: [charter, rules, gameplay]
timestamp: 2026-07-04T00:00:00Z
---

# Business Rules

## Lobby System

- Players do not create accounts. A player enters a Player Name and age.
- Players may Create Game or Join Game.
- Creating a game generates a Game ID and Invite URL (e.g., `https://host/game/ABCD1234`).
- Any player with the link may join.
- The host can: rename game, kick players, change settings, start game.
- The host chooses which age range to allow when creating a game: all ages or a specific age range.
- The game can start with a single player. Additional players can still join before the host starts.
- Once started, joining is disabled.
- Players who join can see the selected age range before joining.
- If no age range is set, all ages are allowed.

## Real-time Gameplay

- There are NO turns. Every player acts simultaneously.
- Every round: Choose City → Travel → Mini Game → Questions (3–5 per round) → Shared World Challenge → Results → Rewards → Next Round.
- Each question has a configurable timer (default: 10 seconds). If a player does not answer in time, they score 0 for that question.

## World

- Players travel from city to city.
- Players cannot visit the same city twice during one game.
- Eventually they return to their starting city, completing their world tour.

## Cities

Each city contains: name, country, coordinates, picture, difficulty, badge, facts, mini game pool, question pool, special ability, music.

## Question System

- Questions are external — never hardcode educational content.
- Supported formats: JSON.
- Categories: Math, Science, Technology, History, Geography, Economics, Environment, Culture.
- Questions are multiple choice with exactly 4 choices each.
- Questions should be short and concise.
- Each question stores: difficulty, answer, choices, assets, explanation, source, min_age, max_age.
- The engine filters questions based on the ages of players in the game. A question is only selected if all players' ages fall within its `min_age`–`max_age` range (or if the range is omitted, the question is available to all ages).
- This allows content creators to target specific age groups per question.

## Mini Games

- Design a plugin architecture. Every mini game is an independent Python package.
- Every mini game implements a common interface.
- The engine discovers installed mini games automatically.
- Future contributors should only create a new folder — no engine modifications required.

## Multiplayer Communication

- REST only for: Create Game, Join Game, Leave Game, Health.
- Everything else must use WebSockets.
- Every WebSocket message must be documented using strongly typed message models.

## Persistence

- Initially: no SQL database. Cities, questions, etc. loaded from JSON files.
- Store everything in Python memory.
- Create repository interfaces so that SQLite, PostgreSQL, and Redis can be used later without modifying engine logic.

## Game Content

- Everything possible should be data-driven: Cities, Questions, Badges, Achievements, Themes, Configuration, Localization, Mini-game metadata, Rewards.
- All should be editable without touching engine code.

## Scoring

- Each correct answer awards 1 point (or 1 coin).
- No negative points for incorrect answers.
- The player with the most points at the end of the game wins.
- Scoring for mini games and shared challenges is defined per mini game plugin.

## Minimum Viable Content (First Release)

- 20 cities, 200 questions, 4 educational categories
- 5 badges, 10 achievements, 5 mini games
- 5 world events, 5 shared challenge types, 4 player avatars

## Backend Philosophy

- FastAPI is NOT simply an API — it IS the game server.
- FastAPI owns: game rules, timers, game state, rooms, players, mini games, events, rewards, badges, achievements, leaderboards, city exploration, question validation, score calculation, victory conditions.
- The frontend never decides game rules.
