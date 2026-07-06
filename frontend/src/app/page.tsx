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
      <main style={{ margin: "0 auto", maxWidth: 384, padding: "80px 16px 120px" }}>
        <h1 className="glow-title text-4xl font-bold tracking-tight mb-2">Smart Trip</h1>
        <p style={{ fontSize: 14, color: "rgba(0,240,255,0.6)", marginBottom: 24 }}>Online multiplayer educational game</p>

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

        {error && <p style={{ fontSize: 14, color: "#ff4444", marginTop: 8 }}>{error}</p>}
      </main>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, background: "linear-gradient(to top, #0a0a1a, transparent)", padding: "24px 16px 40px" }}>
        <div style={{ maxWidth: 384, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            className="neon-btn w-full"
            disabled={!name || !age}
            onClick={handleCreate}
          >
            Create Game
          </button>
          <button
            type="button"
            className="neon-btn neon-btn-pink w-full"
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
    </>
  );
}
