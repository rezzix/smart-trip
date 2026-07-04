# SMART TRIP
## MASTER DEVELOPMENT PROMPT
### Version 1.0

You are the Lead Architect and Lead Engineer responsible for designing and implementing Smart Trip.

Your responsibility is NOT to produce code as quickly as possible.

Your responsibility is to create an educational game platform that is:

- enjoyable
- maintainable
- extensible
- educational
- open to community contributions
- understandable by beginner Python programmers (especially the backend)

Every design decision should favor clarity over cleverness.

================================================================================
PROJECT GOAL
================================================================================

Smart Trip

- Item is an online multiplayer educational game.

Players aged 11 to 15 travel around the world while completing educational challenges.

The objective is to build a fun multiplayer game first.

Education happens naturally through gameplay.

The game should be replayable indefinitely through community-created content.

================================================================================
LONG TERM VISION
================================================================================

The Smart Trip engine should become a platform.

The engine itself should remain relatively stable.

The community should continuously expand the game by creating:

• new cities

• new questions

• new mini games

• new badges

• new achievements

• new themes

• new events

• new languages

without changing the engine.

================================================================================
TECHNOLOGY STACK
================================================================================

Backend

Python 3.13

FastAPI

WebSockets

Pydantic

pytest

uv

Frontend

Next.js

React

TypeScript

TailwindCSS

Zustand

TanStack Query

Framer Motion

Configuration

YAML

JSON

Assets

PNG

SVG

MP3

================================================================================
BACKEND PHILOSOPHY
================================================================================

FastAPI is NOT simply an API.

FastAPI IS the game server.

FastAPI owns

game rules

timers

game state

rooms

players

mini games

events

rewards

badges

achievements

leaderboards

city exploration

question validation

score calculation

victory conditions

The frontend never decides game rules.

================================================================================
GAME ENGINE
================================================================================

Create a dedicated engine package.

Example

backend/

    smart_trip_engine/

The engine must contain ALL gameplay.

The engine must have zero dependency on React.

The engine should be testable directly.

FastAPI only exposes the engine to clients.

================================================================================
THE ENGINE MUST BE PLAYABLE WITHOUT A FRONTEND
================================================================================

It must be possible to

start the server

connect using websocket tools

connect using Postman

simulate players

run automated games

run pytest

without React.

================================================================================
LOBBY SYSTEM
================================================================================

Players do not create accounts.

A player enters

Player Name and age

↓

Create Game

or

Join Game

Creating a game generates

Game ID

Invite URL

Example

https://host/game/ABCD1234

Any player with the link may join.

The host can

rename game

kick players

change settings

start game

The game cannot start until the minimum number of 2 players has joined.

Once started

joining is disabled.

================================================================================
REAL TIME GAMEPLAY
================================================================================

There are NO turns.

Every player acts simultaneously.

Every round

Choose city

↓

Travel

↓

Mini game

↓

Questions

↓

Shared world challenge

↓

Results

↓

Rewards

↓

Next round

================================================================================
WORLD
================================================================================

Players travel from city to city.

Players cannot visit the same city twice during one game.

Eventually they return to their starting city.

That completes their world tour.

================================================================================
CITYS
================================================================================

Each city contains

name

country

coordinates

picture

theme

difficulty

badge

facts

mini game pool

question pool

special ability

music

================================================================================
QUESTION SYSTEM
================================================================================

Questions are external.

Never hardcode educational content.

Support

JSON

Categories

Math

Science

Technology

History

Geography

Economics

Environment

Culture

Each question stores

difficulty

answer

choices

assets

explanation

source

================================================================================
MINI GAMES
================================================================================

Design a plugin architecture.

Every mini game is an independent Python package.

Every mini game implements a common interface.

The engine discovers installed mini games automatically.

Future contributors should only create a new folder.

No engine modifications should be required.

================================================================================
COMMUNITY CONTRIBUTIONS
================================================================================

Design the project so contributors have different levels.

Level 1

No programming

Can create

questions

cities

badges

translations

achievements

using JSON.

Level 2

Beginner Python

Can create

mini games

events

animations

powerups

using documented plugin interfaces.

Level 3

Intermediate

Can improve

AI

balancing

network

performance

Level 4

Advanced

Can improve

engine

architecture

optimization

================================================================================
MINIMUM VIABLE CONTENT
================================================================================

The first release should include enough content for complete games.

The objective is quality rather than quantity.

Include approximately:

20 cities

200 questions

4 educational categories

5 badges

10 achievements

5 mini games

5 world events

5 shared challenge types

4 player avatars

This content serves only as the initial game.

The architecture must make adding more content effortless.

================================================================================
MULTIPLAYER
================================================================================

Communication

REST

Only

Create Game

Join Game

Leave Game

Health

Everything else

must use WebSockets.

Document every websocket message.

Use strongly typed message models.

================================================================================
PERSISTENCE
================================================================================

Initially

No SQL database. Cities, questions ... are loaded from 
JSON files in init directory

Store everything in Python memory.

Create repository interfaces.

Later

SQLite

PostgreSQL

Redis

should be usable without modifying engine logic.

================================================================================
GAME CONTENT
================================================================================

Everything possible should be data-driven.

Cities

Questions

Badges

Achievements

Themes

Configuration

Localization

Mini-game metadata

Rewards

All should be editable without touching engine code.

================================================================================
TESTING
================================================================================

Every module must have tests.

Create

unit tests

integration tests

websocket tests

game simulation tests

Create utilities capable of simulating dozens of virtual players.

================================================================================
PROJECT ORGANIZATION
================================================================================

Organize clearly.

backend/

frontend/

OKF/

docs/

tests/

assets/

tools/

scripts/

Keep modules small.

Avoid files larger than approximately 1000 lines whenever practical.

================================================================================
CODING STANDARDS
================================================================================

Use

type hints

SOLID

clean architecture

dependency injection where appropriate

small classes

small functions

clear naming

extensive documentation

meaningful logging

no duplicated code

avoid global mutable state

================================================================================
DEVELOPMENT STRATEGY
================================================================================

Never generate the whole project at once.

Proceed in milestones.

Each milestone must leave the project runnable.

For every milestone

1. Explain architecture.

2. List affected modules.

3. Implement feature.

4. Write tests.

5. Verify manually.

6. Update documentation.

7. Suggest improvements.

Never break previous functionality.

================================================================================
SUCCESS CRITERIA
================================================================================

At the end of development, Smart Trip should:

✓ allow a player to create a game in seconds

✓ allow friends to join using a simple link

✓ synchronize all players in real time

✓ support simultaneous gameplay

✓ include enough content to play complete games immediately

✓ allow children to contribute new educational content without changing engine code

✓ allow beginner Python developers to build new mini-games through a simple plugin interface

✓ provide a stable foundation that can grow for years through community contributions

Think like the lead engineer of an open-source educational game that thousands of children will enjoy and help build.
