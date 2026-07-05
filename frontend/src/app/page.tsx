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
      <main className="relative z-10 flex min-h-dvh w-full flex-col items-center gap-6 px-6 pb-28 pt-12 overflow-y-auto">
        <div className="flex flex-col items-center gap-3">
          <h1 className="glow-title text-4xl sm:text-6xl font-bold tracking-tight" style={{ animationDelay: "0s" }}>
            Smart Trip
          </h1>
          <p className="fade-in-up text-sm sm:text-lg" style={{ animationDelay: "0.2s", color: "rgba(0,240,255,0.7)" }}>
            Online multiplayer educational game
          </p>
        </div>

        <div className="fade-in-up flex w-full max-w-sm flex-col items-center gap-3" style={{ animationDelay: "0.4s" }}>
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

          {error && <p className="fade-in-up text-red-400 text-sm">{error}</p>}
        </div>

        <div className="fade-in-up fixed bottom-0 left-0 right-0 z-20 flex justify-center gap-3 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a] to-transparent px-6 pt-4 pb-8" style={{ animationDelay: "0.6s" }}>
          <div className="flex w-full max-w-sm gap-3">
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
        </div>
      </main>
    </>
  );
}
