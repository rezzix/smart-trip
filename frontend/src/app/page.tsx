"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createGame, joinGame } from "@/api/client";
import ParticleBackground from "@/components/ParticleBackground";
import { playClick, playStart } from "@/lib/sound";

const STORAGE_KEY = "smart_trip_player";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { name: n, age: a } = JSON.parse(saved);
        if (n) setName(n);
        if (a) setAge(a);
      } catch { /* ignore */ }
    }
  }, []);

  const saveAndNavigate = (gameId: string, playerId: string, playerName: string, playerAge: number, isHost: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: playerName, age: playerAge }));
    const params = new URLSearchParams({
      playerId,
      playerName,
      playerAge: String(playerAge),
      isHost: String(isHost),
    });
    setTimeout(() => router.push(`/game/${gameId}?${params}`), 300);
  };

  const handleCreate = async () => {
    if (!name || !age) return;
    playClick();
    try {
      const res = await createGame(name, parseInt(age));
      playStart();
      saveAndNavigate(res.game_id, res.player_id, name, parseInt(age), true);
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
      saveAndNavigate(res.game_id, res.player_id, name, parseInt(age), false);
    } catch {
      setError("Game not found or already started");
    }
  };

  return (
    <>
      <ParticleBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-8 px-6 py-16 pt-24 overflow-y-auto">
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
