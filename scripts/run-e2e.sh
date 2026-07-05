#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cleanup() {
  echo "Cleaning up..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  wait $BACKEND_PID 2>/dev/null || true
  wait $FRONTEND_PID 2>/dev/null || true
}
trap cleanup EXIT

echo "Starting backend..."
cd "$ROOT_DIR/backend"
uv run uvicorn smart_trip.main:app --port 8000 &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$ROOT_DIR/frontend"
pnpm dev --port 3000 &
FRONTEND_PID=$!

echo "Waiting for backend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "Backend ready."
    break
  fi
  sleep 1
done

echo "Waiting for frontend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend ready."
    break
  fi
  sleep 1
done

echo "Running Playwright e2e tests..."
cd "$ROOT_DIR/frontend"
pnpm exec playwright test --reporter=list

echo "Done. Videos saved to frontend/test-results/"
