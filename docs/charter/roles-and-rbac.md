---
type: Charter/Section
title: Roles & RBAC
description: Player roles, host privileges, and community contribution levels for Smart Trip.
tags: [charter, roles, permissions, community]
timestamp: 2026-07-04T00:00:00Z
---

# Roles & RBAC

## Player Roles

### Host
- Creates the game room
- Can rename game, kick players, change settings, start game
- Only one host per game session

### Player
- Joins via invite link
- Chooses city, answers questions, plays mini games
- Competes simultaneously with other players

### Spectator (future)
- Can join and observe but not interact (not in MVP)

## RBAC Rules

- No authentication system in MVP — no accounts, no passwords.
- Host status is granted to the player who creates the room.
- If the host leaves, host privileges transfer to the next joined player.
- All players have equal gameplay capabilities once the game starts.
- Kick/ban is host-only and only applies to the current session.

## Community Contribution Levels

| Level | Skill | Can Create |
|-------|-------|------------|
| Level 1 | No programming | Questions, cities, badges, translations, achievements using JSON |
| Level 2 | Beginner Python | Mini games, events, animations, powerups via documented plugin interfaces |
| Level 3 | Intermediate | AI, balancing, network, performance improvements |
| Level 4 | Advanced | Engine, architecture, optimization improvements |

## Engine Ownership

- The engine package (`smart_trip_engine/`) is owned by core maintainers.
- Plugin interfaces are the contract between the engine and community contributions.
- No engine modification is required for Levels 1 and 2 contributions.
