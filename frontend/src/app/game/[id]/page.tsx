"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useGameStore } from "@/stores/game";

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const didInit = useRef(false);

  const {
    screen, players, isHost, playerId, question, roundResult,
    finalScores, winner, error, sendMessage, setPlayerInfo,
    setGameId, setIsHost, setScreen, connectWs,
  } = useGameStore();

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const pid = searchParams.get("playerId");
    const name = searchParams.get("playerName");
    const age = searchParams.get("playerAge");
    const host = searchParams.get("isHost") === "true";

    if (!pid || !name || !age) {
      window.location.href = "/";
      return;
    }

    useGameStore.setState({ playerName: name, playerAge: parseInt(age), playerId: pid, gameId: id, isHost: host, screen: "lobby", players: [{ id: pid, name, score: 0 }] });
    connectWs(id, pid);
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <p className="text-red-400">Error: {error}</p>
        <a href="/" className="text-blue-400 underline">Back to home</a>
      </main>
    );
  }

  if (screen === "lobby" || !playerId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h2 className="text-3xl font-bold">Waiting Room</h2>
        <p className="text-gray-400">Game ID: <span className="font-mono text-white">{id}</span></p>
        <p className="text-gray-400">Invite friends by sharing this ID</p>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">Players ({players.length})</p>
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>{p.name}{p.id === playerId ? " (you)" : ""}</span>
              {p.id === players[0]?.id && <span className="text-xs text-yellow-400">(host)</span>}
            </div>
          ))}
        </div>

        {isHost && players.length >= 2 && (
          <button
            type="button"
            className="rounded-lg bg-green-600 px-6 py-3 font-medium transition hover:bg-green-500"
            onClick={() => sendMessage("start_game")}
          >
            Start Game
          </button>
        )}

        {isHost && players.length < 2 && (
          <p className="text-sm text-gray-500">Waiting for at least 2 players...</p>
        )}
      </main>
    );
  }

  if (screen === "question" && question) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <div className="flex gap-2 text-sm text-gray-500">
          <span>Question {question.question_index + 1} of {question.total}</span>
        </div>

        <h2 className="max-w-lg text-center text-2xl font-semibold">{question.text}</h2>

        <div className="grid w-full max-w-md grid-cols-1 gap-3">
          {question.choices.map((choice, i) => (
            <button
              key={`${question.question_index}-${i}`}
              type="button"
              className="rounded-lg border border-gray-600 px-6 py-4 text-left font-medium transition hover:bg-gray-800"
              onClick={() => sendMessage("answer", { choice: i })}
            >
              <span className="mr-3 text-gray-500">{String.fromCharCode(65 + i)}.</span>
              {choice}
            </button>
          ))}
        </div>

        {roundResult && (
          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
            {roundResult.results.filter((r) => r.player_id === playerId).map((r) => (
              <p key={r.player_id} className={r.correct ? "text-green-400" : "text-red-400"}>
                {r.correct ? "Correct!" : "Wrong!"} — {roundResult.explanation}
              </p>
            ))}
          </div>
        )}
      </main>
    );
  }

  if (screen === "results") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h2 className="text-3xl font-bold">Game Over!</h2>
        <p className="text-xl text-yellow-400">Winner: {winner}</p>

        <div className="flex flex-col gap-2">
          {finalScores.map((p, i) => (
            <div key={p.player_id} className="flex w-80 items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
              <span>
                {i + 1}. {p.name}{p.player_id === playerId ? " (you)" : ""}
              </span>
              <span className="font-bold">{p.score} pts</span>
            </div>
          ))}
        </div>

        <a href="/" className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500">
          Play Again
        </a>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p className="text-gray-400">Loading...</p>
    </main>
  );
}
