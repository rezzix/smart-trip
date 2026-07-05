"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createGame, joinGame } from "@/api/client";
import ParticleBackground from "@/components/ParticleBackground";
import { playClick, playStart } from "@/lib/sound";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name || !age) return;
    playClick();
    try {
      const res = await createGame(name, parseInt(age));
      playStart();
      const params = new URLSearchParams({
        playerId: res.player_id,
        playerName: name,
        playerAge: String(age),
        isHost: "true",
      });
      setTimeout(() => router.push(`/game/${res.game_id}?${params}`), 300);
    } catch {
      setError("Failed to create game");
    }
  };

  const handleJoinWithId = async (joinId: string) => {
    if (!name || !age || !joinId) return;
    playClick();
    try {
      const res = await joinGame(joinId, name, parseInt(age));
      playStart();
      const params = new URLSearchParams({
        playerId: res.player_id,
        playerName: name,
        playerAge: String(age),
        isHost: "false",
      });
      setTimeout(() => router.push(`/game/${res.game_id}?${params}`), 300);
    } catch {
      setError("Game not found or already started");
    }
  };

  return (
    <>
      <ParticleBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="glow-title text-6xl font-bold tracking-tight" style={{ animationDelay: "0s" }}>
          Smart Trip
        </h1>
        <p className="fade-in-up text-lg" style={{ animationDelay: "0.2s", color: "rgba(0,240,255,0.7)" }}>
          Online multiplayer educational game
        </p>

        <div className="fade-in-up flex w-full max-w-sm flex-col gap-4" style={{ animationDelay: "0.4s" }}>
          <input
            className="neon-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="neon-input"
            placeholder="Your age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="fade-in-up flex gap-4" style={{ animationDelay: "0.6s" }}>
          <button
            type="button"
            className="neon-btn"
            disabled={!name || !age}
            onClick={handleCreate}
          >
            Create Game
          </button>
          <button
            type="button"
            className="neon-btn neon-btn-pink"
            disabled={!name || !age}
            onClick={() => {
              const id = prompt("Enter game ID:");
              if (id) handleJoinWithId(id);
            }}
          >
            Join Game
          </button>
        </div>

        {error && <p className="fade-in-up text-red-400">{error}</p>}
      </main>
    </>
  );
}
