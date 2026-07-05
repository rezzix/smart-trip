const API_BASE = "http://localhost:8000/api/v1";

export interface CreateGameResponse {
  game_id: string;
  invite_url: string;
  player_id: string;
}

export interface JoinGameResponse {
  player_id: string;
  game_id: string;
}

export async function createGame(name: string, age: number): Promise<CreateGameResponse> {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age }),
  });
  if (!res.ok) throw new Error("Failed to create game");
  return res.json();
}

export async function joinGame(gameId: string, name: string, age: number): Promise<JoinGameResponse> {
  const res = await fetch(`${API_BASE}/games/${gameId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age }),
  });
  if (!res.ok) throw new Error("Game not found or already started");
  return res.json();
}
