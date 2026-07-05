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
      <main style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, maxWidth: 384, marginInline: "auto", padding: "24px 16px 48px" }}>
        <h1 className="glow-title" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>Smart Trip</h1>
        <p style={{ fontSize: 14, color: "rgba(0,240,255,0.6)", margin: 0 }}>Online multiplayer educational game</p>

        <input
          className="neon-input"
          style={{ width: "100%" }}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="neon-input"
          style={{ width: "100%" }}
          placeholder="Your age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {error && <p style={{ fontSize: 14, color: "#ff4444", margin: 0 }}>{error}</p>}

        <button
          type="button"
          className="neon-btn"
          style={{ width: "100%" }}
          disabled={!name || !age}
          onClick={handleCreate}
        >
          Create Game
        </button>
        <button
          type="button"
          className="neon-btn neon-btn-pink"
          style={{ width: "100%" }}
          disabled={!name || !age}
          onClick={() => {
            const id = prompt("Enter game ID:");
            if (id) handleJoinWithId(id);
          }}
        >
          Join Game
        </button>
      </main>
    </>
  );
}
