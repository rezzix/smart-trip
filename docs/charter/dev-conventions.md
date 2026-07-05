---
type: Charter/Section
title: Developer Conventions
description: Coding standards, SOLID principles, documentation, and development process for Smart Trip.
tags: [charter, conventions, standards, development]
timestamp: 2026-07-04T00:00:00Z
---

# Developer Conventions

## Guiding Principles

- Every design decision should favor clarity over cleverness.
- The codebase must be understandable by beginner Python programmers (especially the backend).
- The project must be open to community contributions.

## Coding Standards

- Use type hints everywhere (Python) and TypeScript (frontend).
- Follow SOLID principles.
- Use clean architecture with dependency injection where appropriate.
- Prefer small classes and small functions.
- Use clear, self-documenting naming.
- Write extensive documentation.
- Include meaningful logging.
- No duplicated code.
- Avoid global mutable state.

## Project Organization

```
backend/          — Python FastAPI game server + engine
frontend/         — Next.js React application
OKF/              — Open Knowledge Format knowledge base
docs/             — Documentation
tests/            — Test suites
assets/           — Game assets (PNG, SVG, MP3)
tools/            — Utility tools
scripts/          — Automation scripts
```

## Repository Conventions

- Keep modules small. Avoid files larger than ~1000 lines.
- Organize by domain, not by layer.

## Development Process

- Never generate the whole project at once — proceed in milestones.
- Each milestone must leave the project runnable.
- For every milestone:
  1. Explain architecture
  2. List affected modules
  3. Implement feature
  4. Write tests
  5. Verify manually
  6. Update documentation
  7. Suggest improvements
- Never break previous functionality.

## Configuration

- Use YAML and JSON for configuration and data files.
- Game content files are JSON for Level 1 contributor accessibility.
