---
type: Charter/Section
title: Design & Navigation
description: UX principles, game flow, and navigation structure for Smart Trip.
tags: [charter, design, ux, navigation]
timestamp: 2026-07-04T00:00:00Z
---

# Design & Navigation

## UX Principles

- The game must be approachable for all ages — no complex menus or registration.
- A player should create or join a game in seconds.
- The frontend is a rendering client; all game logic lives in the backend.
- Animations (Framer Motion) enhance engagement but never block gameplay.

## Game Flow Navigation

```
                    ┌──────────────┐
                    │   Home/Lobby  │
                    │ (Name + Age)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │Create    │ │ Join     │ │(Settings)│
        │Game      │ │ Game     │ │          │
        └────┬─────┘ └────┬─────┘ └──────────┘
             │            │
             └─────┬──────┘
                   ▼
          ┌────────────────┐
          │   Game Lobby   │
          │ (Waiting Room) │
          │  min 2 players │
          └───────┬────────┘
                  │ Host clicks Start
                  ▼
     ┌──────────────────────────┐
     │       Game Loop          │
     │  ┌────────────────────┐  │
     │  │ Choose City        │  │
     │  ├────────────────────┤  │
     │  │ Travel Animation   │  │
     │  ├────────────────────┤  │
     │  │ Mini Game          │  │
     │  ├────────────────────┤  │
     │  │ Questions          │  │
     │  ├────────────────────┤  │
     │  │ Shared Challenge   │  │
     │  ├────────────────────┤  │
     │  │ Results & Rewards  │  │
     │  └────────────────────┘  │
     │         repeat           │
     └──────────────────────────┘
                  │
                  ▼
          ┌────────────────┐
          │  World Tour    │
          │  Complete!     │
          │ (Final Results)│
          └────────────────┘
```

## Screen Map (MVP)

1. **Landing Page** — Name + Age input, Create/Join buttons
2. **Lobby Screen** — Player list, game settings (host), game ID, invite link, Start button (host)
3. **World Map** — City selection with available routes highlighted
4. **Travel Screen** — Travel animation between cities
5. **Mini Game Screen** — Active mini game with countdown timer
6. **Question Screen** — Question with choices, timer, progress indicator
7. **Shared Challenge Screen** — Collaborative/competitive group challenge
8. **Round Results Screen** — Scores, badges earned, leaderboard update
9. **End Game Screen** — Final standings, stats, play again option

## Navigation Rules

- WebSocket drives real-time screen transitions.
- All players see the same screen simultaneously (synchronized).
- Loading states show animated transitions (Framer Motion).
- Error states show a friendly message with a retry option.
- Empty states guide the player (e.g., "Share this link with friends!").
