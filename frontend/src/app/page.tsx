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
    router.push(`/game/${gameId}?${params}`);
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
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-sm flex-col items-center gap-4 px-4 py-10">
        <h1 className="glow-title text-4xl font-bold tracking-tight">Smart Trip</h1>
        <p className="text-sm" style={{ color: "rgba(0,240,255,0.6)" }}>
          Online multiplayer educational game
        </p>

        <input
          className="neon-input w-full"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="neon-input w-full"
          placeholder="Your age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="mt-8 flex w-full gap-3">
          <button
            type="button"
            className="neon-btn flex-1"
            disabled={!name || !age}
            onClick={handleCreate}
          >
            Create Game
          </button>
          <button
            type="button"
            className="neon-btn neon-btn-pink flex-1"
            disabled={!name || !age}
            onClick={() => {
              const id = prompt("Enter game ID:");
              if (id) handleJoinWithId(id);
            }}
          >
            Join Game
          </button>
        </div>
      </main>
    </>
  );
}
