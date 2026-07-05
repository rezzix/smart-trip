---
name: milestone-developer
description: Instructions for developing a project milestone — scaffold, implement, document, update GitHub project board, and create issues.
---

# Milestone Developer

Follow these steps every time you are asked to develop a milestone (scaffold, POC, MVP, v1.x, etc.).

---

## 1. Read the Milestone Spec

Open `docs/charter/milestones.md` and read the deliverable table for the requested milestone. Every decision must align with the charter (tech stack, architecture, business rules, conventions).

## 2. Clarify Before You Build

- **Ask clarifying questions** about the milestone scope, priorities, and any ambiguity in the charter spec.
- If the user's answers **bring new details** beyond the charter, add them to the relevant charter file and update milestones.md if needed.
- If the user's answers **contradict the charter**, flag the contradiction and push the user to decide which to retain, then update the charter accordingly.
- Open `docs/state/` to understand what is currently implemented.
- Break the milestone into discrete tasks (one per deliverable cell in the milestone table).
- For each task, identify which charter sections apply (tech choices, architecture patterns, business rules).

## 3. Implement

Follow the charter's dev conventions:
- Type hints, SOLID, clean architecture, small files, clear naming.
- Proceed task by task. Each task must leave the project runnable.
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.

## 4. Test

### Backend Tests
- Run after every task: `cd backend && uv run pytest`.
- Verify manually where applicable (boot server, hit endpoint, check response).
- Update `docs/state/test-plans.md` if new tests are added or existing ones change status.

### End-to-End Tests (Playwright)
- Write a Playwright e2e test for every milestone that covers the main user flows.
- Tests go in `frontend/e2e/` directory named `<milestone>.spec.ts` (e.g. `poc.spec.ts`, `mvp.spec.ts`).
- The Playwright config must launch both the frontend and backend before running.
- If errors occur, fix them before proceeding.

### Video Recording
- When the test uses `browser.newContext()`, pass `recordVideo: { dir: "test-results/videos", size: { width: 1280, height: 720 } }` to each context.
- Add short `pause()` calls (300–500ms) between user actions so the video is watchable.
- After all tests pass, copy the generated `.webm` files from `test-results/videos/` to `docs/e2e/videos/`.
- Rename each video to `<milestone>-<description>.webm` (e.g. `poc-alice.webm`, `poc-bob.webm`, `mvp-lobby.webm`).
- Commit the videos and reference them in the GitHub issue comments.

## 5. Update Documentation (State)

After the milestone is complete, update every relevant file in `docs/state/`:

| File | What to update |
|------|----------------|
| `index.md` | Advancement summary table and changelog entry |
| `development-status.md` | Module table (mark as implemented), entity diagrams if new modules were built, list of implemented files |
| `test-plans.md` | Mark test plans as executed with pass/fail and date |
| `api-endpoints.md` | Move endpoints from Planned to Implemented, add any new endpoints |
| `seeding-and-test-data.md` | Note any seed data or test fixtures created |
| `quickstart.md` | Ensure setup/run instructions match reality |

## 6. Update GitHub Project Board

Project board: https://github.com/users/rezzix/projects/9

For each task in the milestone:
1. Create a GitHub issue describing the task.
2. Add the issue to the project board with the appropriate status.
3. As you work, comment on the issue with implementation notes.
4. When ready for review, move the card to **"In Review"** status.
5. If a task cannot be completed or reveals a new required task, create a backlog issue tagged for the developer or another agent to fix.

## 7. Wrap Up

- Commit all changes with a conventional commit message summarizing the milestone.
- Optionally generate a brief milestone summary for the changelog.
- Never update `docs/charter/` unless explicitly asked or unless the clarification phase produces new or contradictory information that the user agrees to update.
