---
type: Charter/Section
title: UX & UI Design
description: Visual style, interaction principles, animation guidelines, and audio design for Smart Trip.
tags: [charter, ux, ui, design, animations, audio]
timestamp: 2026-07-05T00:00:00Z
---

# UX & UI Design

## Visual Style: Neon / Synthwave

- Dark backgrounds (`#0a0a1a` to `#1a0a2e`) as canvas.
- Vibrant neon accents: cyan (`#00f0ff`), pink (`#ff00aa`), purple (`#aa00ff`), yellow (`#ffdd00`).
- Glowing borders and drop shadows on interactive elements.
- Gradient overlays with neon color transitions.
- Rounded corners on cards, buttons, and containers.
- Monospace or futuristic sans-serif fonts for headings.
- Readable sans-serif for body text (accessibility for ages 11–15).

## Interaction Principles

- Keyboard input is used only when required (e.g., name entry, game ID).
- All game actions are click/tap driven: answer choices, start game, join game, navigate.
- Every clickable element has a visible hover state (glow, scale, or color shift).
- Feedback is immediate: button press shows visual response within 100ms.
- Error states show a clear message with a retry option.

## Animations

### Decorative
- Animated background: floating particles, grid lines, or gradient shifts.
- Subtle pulsing glow on the game title.
- Ambient neon flicker on borders (subtle, not distracting).

### Functional
- Screen transitions: smooth fade + slide between lobby, question, and results.
- Question entry: fade in with a slight scale bounce.
- Timer countdown: animated ring or bar that changes color as time runs low (< 3s = red pulse).
- Correct answer: brief green flash / checkmark animation on the selected choice.
- Wrong answer: brief red shake on the selected choice.
- Results screen: scores animate/stagger into view.
- Button hover: scale up 1.05x + increased glow.

## Audio

- Button clicks: short tactile pop sound.
- Start game: whoosh or chime.
- Question appears: soft notification ping.
- Correct answer: cheerful ding (1 sec).
- Wrong answer: low buzz or gentle error tone (0.5 sec).
- Timer warning (< 3s): ticking or heartbeat sound.
- Round end: fanfare or victory jingle.
- Results appear: subtle reveal swoosh.

All sound effects should be short (< 2s), loop-free, and in `.mp3` or `.wav` format stored in `assets/audio/ui/`.

## Screen Design Principles

### Landing Page
- Dark neon background with animated particles.
- Game title in large glowing neon text.
- Name and age inputs: dark input fields with neon border on focus.
- Create / Join buttons: neon gradient, full width on mobile, side by side on desktop.

### Lobby
- Player list with neon avatar dots (green for connected).
- Game ID displayed prominently for sharing.
- Start Game button: large, pulsing glow when 2+ players ready, disabled/dim otherwise.

### Question Screen
- Question text centered, white on dark, subtle glow.
- Four choice buttons: dark cards with neon border, glow on hover.
- Timer ring/circle at top or beside question, animated countdown.
- Correct/wrong feedback: full-card color flash + icon overlay.

### Results Screen
- "Game Over!" in large neon text.
- Podium-style leaderboard: gold/silver/bronze neon colors for top 3.
- Each player row: name + score with animated count-up.
- Play Again button: prominent neon gradient.

## Accessibility

- Minimum 4.5:1 contrast ratio for all text.
- Hover states also work on focus (keyboard tab).
- Buttons have visible focus rings.
- Animations respect `prefers-reduced-motion` (disable decorative, keep functional).
- Audio is not required for gameplay — all feedback is also visual.
