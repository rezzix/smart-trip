"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createGame, joinGame } from "@/api/client";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name || !age) return;
    try {
      const res = await createGame(name, parseInt(age));
      const params = new URLSearchParams({
        playerId: res.player_id,
        playerName: name,
        playerAge: String(age),
        isHost: "true",
      });
      router.push(`/game/${res.game_id}?${params}`);
    } catch {
      setError("Failed to create game");
    }
  };

  const handleJoinWithId = async (joinId: string) => {
    if (!name || !age || !joinId) return;
    try {
      const res = await joinGame(joinId, name, parseInt(age));
      const params = new URLSearchParams({
        playerId: res.player_id,
        playerName: name,
        playerAge: String(age),
        isHost: "false",
      });
      router.push(`/game/${res.game_id}?${params}`);
    } catch {
      setError("Game not found or already started");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-bold tracking-tight">Smart Trip</h1>
      <p className="text-lg text-gray-400">Online multiplayer educational game</p>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <input
          className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500"
          placeholder="Your age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-50"
          disabled={!name || !age}
          onClick={handleCreate}
        >
          Create Game
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-600 px-6 py-3 font-medium transition hover:bg-gray-800 disabled:opacity-50"
          disabled={!name || !age}
          onClick={() => {
            const id = prompt("Enter game ID:");
            if (id) {
              handleJoinWithId(id);
            }
          }}
        >
          Join Game
        </button>
      </div>

      {error && <p className="text-red-400">{error}</p>}
    </main>
  );
}
