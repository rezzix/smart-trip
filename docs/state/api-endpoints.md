---
type: State/Section
title: API Endpoints
description: REST and WebSocket API endpoints for Smart Trip, with request/response schemas.
tags: [state, api, endpoints, websocket]
timestamp: 2026-07-04T00:00:00Z
---

# API Endpoints

> **Note:** No API endpoints have been implemented yet. This document tracks the planned API surface as defined in the charter.

## REST Endpoints

Base path: `/api/v1`

| Method | Path | Purpose | Request Body | Response | Status |
|--------|------|---------|-------------|----------|--------|
| POST | `/games` | Create a new game | `{ name, age, age_range_min?, age_range_max? }` | `{ game_id, invite_url }` | Planned |
| POST | `/games/{game_id}/join` | Join an existing game | `{ name, age }` | `{ player_id, game_state }` | Planned |
| POST | `/games/{game_id}/leave` | Leave a game | `{ player_id }` | `{ success }` | Planned |
| GET | `/health` | Health check | — | `{ status: "ok" }` | Planned |

## WebSocket Endpoints

| Path | Purpose | Messages (Client → Server) | Messages (Server → Client) | Status |
|------|---------|---------------------------|---------------------------|--------|
| `/ws/game/{game_id}/{player_id}` | Real-time gameplay | `player_action`, `chat_message`, `answer_question`, `select_city`, `start_game` (host), `kick_player` (host), `change_settings` (host) | `state_update`, `round_start`, `round_end`, `question`, `mini_game`, `results`, `reward`, `player_joined`, `player_left`, `error` | Planned |

## Planned Message Schemas

### Client → Server

| Message Type | Payload |
|-------------|---------|
| `start_game` | `{}` (host only) |
| `select_city` | `{ city_id }` |
| `answer_question` | `{ question_id, choice }` |
| `mini_game_action` | `{ action, data }` |
| `kick_player` | `{ target_player_id }` (host only) |
| `change_settings` | `{ age_range_min?, age_range_max? }` (host only) |
| `chat_message` | `{ text }` |

### Server → Client

| Message Type | Payload |
|-------------|---------|
| `state_update` | `{ phase, players, scores, current_city, ... }` |
| `round_start` | `{ round_number, cities_available }` |
| `question` | `{ question_id, text, choices, timer_seconds }` |
| `mini_game_start` | `{ mini_game_type, config, timer_seconds }` |
| `mini_game_result` | `{ scores, rankings }` |
| `round_result` | `{ round_scores, badges_earned, leaderboard }` |
| `player_joined` | `{ player_id, name }` |
| `player_left` | `{ player_id }` |
| `error` | `{ code, message }` |
| `game_over` | `{ final_leaderboard, stats }` |

## Error Codes

| Code | Meaning |
|------|---------|
| `GAME_NOT_FOUND` | Game ID does not exist |
| `GAME_FULL` | Game has already started or is full |
| `AGE_RESTRICTED` | Player age is outside the game's age range |
| `NOT_HOST` | Action requires host privileges |
| `INVALID_ACTION` | Action not valid in current game phase |
| `PLAYER_NOT_FOUND` | Player ID not recognized |
