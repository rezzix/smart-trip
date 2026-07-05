"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useGameStore } from "@/stores/game";
import ParticleBackground from "@/components/ParticleBackground";
import { playClick, playCorrect, playWrong, playTimerWarning, playFanfare, playReveal } from "@/lib/sound";

function TimerDisplay({ seconds }: { seconds: number }) {
  const urgent = seconds <= 3;
  useEffect(() => {
    if (urgent) playTimerWarning();
  }, [urgent]);

  return (
    <div className={`timer-ring ${urgent ? "urgent" : ""}`}>
      {seconds}
    </div>
  );
}

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const didInit = useRef(false);
  const [timer, setTimer] = useState(10);

  const {
    screen, players, isHost, playerId, question, roundResult,
    finalScores, winner, isTie, error, sendMessage,
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
    useGameStore.getState().connectWs(id, pid);
  }, []);

  useEffect(() => {
    if (screen === "question" && question) {
      setTimer(question.time_remaining);
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screen, question]);

  useEffect(() => {
    if (roundResult) {
      const myResult = roundResult.results.find((r) => r.player_id === playerId);
      if (myResult) {
        if (myResult.correct) playCorrect();
        else playWrong();
      }
    }
  }, [roundResult, playerId]);

  useEffect(() => {
    if (screen === "results") {
      playFanfare();
      const t = setTimeout(() => playReveal(), 500);
      return () => clearTimeout(t);
    }
  }, [screen]);

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
      <>
        <ParticleBackground />
        <main className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex w-full max-w-sm flex-col items-center gap-6"
          >
            <h2 className="glow-title-pink text-4xl font-bold">Waiting Room</h2>

            <div className="neon-card p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Game ID</p>
              <p className="font-mono text-2xl font-bold" style={{ color: "var(--neon-cyan)" }}>
                {id}
              </p>
              <p className="mt-2 text-sm" style={{ color: "rgba(0,240,255,0.6)" }}>
                Share this ID with friends to join
              </p>
            </div>

            <div className="neon-card w-80 p-4">
              <p className="text-sm mb-3" style={{ color: "rgba(0,240,255,0.7)" }}>
                Players ({players.length})
              </p>
              <div className="flex flex-col gap-2">
                {players.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="h-3 w-3 rounded-full" style={{
                      background: p.id === playerId ? "var(--neon-cyan)" : "var(--neon-pink)",
                      boxShadow: `0 0 6px ${p.id === playerId ? "var(--neon-cyan)" : "var(--neon-pink)"}`,
                    }} />
                    <span>{p.name}{p.id === playerId ? " (you)" : ""}</span>
                    {p.id === players[0]?.id && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{
                        background: "rgba(255, 221, 0, 0.15)",
                        color: "var(--neon-yellow)",
                      }}>HOST</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {isHost && (
              <motion.button
                type="button"
                className="neon-btn neon-btn-pink neon-btn-start mt-8"
                onClick={() => { playClick(); sendMessage("start_game"); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            )}
          </motion.div>
        </main>
      </>
    );
  }

  if (screen === "question" && question) {
    return (
      <>
        <ParticleBackground />
        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.question_index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex w-full max-w-lg flex-col items-center gap-8"
            >
              <div className="flex items-center gap-4">
                <TimerDisplay seconds={timer} />
                <div className="text-sm" style={{ color: "rgba(0,240,255,0.6)" }}>
                  Question {question.question_index + 1} of {question.total}
                </div>
              </div>

              <h2 className="max-w-lg text-center text-2xl font-semibold">
                {question.text}
              </h2>

              <div className="grid w-full max-w-md grid-cols-2 gap-4">
                {question.choices.map((choice, i) => {
                  const myResult = roundResult?.results.find((r) => r.player_id === playerId);
                  const isSelected = myResult && question.choices.indexOf(choice) !== -1;
                  const isCorrectChoice = myResult && i === roundResult?.correct_answer;

                  let extraClass = "";
                  if (roundResult) {
                    if (isCorrectChoice) extraClass = "correct";
                    else if (isSelected && !myResult?.correct) extraClass = "wrong";
                  }

                  return (
                    <motion.button
                      key={`${question.question_index}-${i}`}
                      type="button"
                      className={`choice-btn ${extraClass}`}
                      onClick={() => {
                        if (!roundResult) {
                          playClick();
                          sendMessage("answer", { choice: i });
                        }
                      }}
                      disabled={!!roundResult}
                      whileHover={!roundResult ? { scale: 1.02, x: 4 } : {}}
                      whileTap={!roundResult ? { scale: 0.98 } : {}}
                    >
                      <span className="mr-3" style={{ color: "var(--neon-cyan)" }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {choice}
                    </motion.button>
                  );
                })}
              </div>

              {roundResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="neon-card w-full max-w-md p-4"
                >
                  {roundResult.results.filter((r) => r.player_id === playerId).map((r) => (
                    <p key={r.player_id} className={r.correct ? "text-[#00ff88]" : "text-[#ff4444]"}>
                      {r.correct ? "✓ Correct!" : "✗ Wrong!"} — {roundResult.explanation}
                    </p>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </>
    );
  }

  if (screen === "results") {
    return (
      <>
        <ParticleBackground />
        <main className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 pt-12 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex w-full flex-col items-center gap-8"
          >
            <h2 className="glow-title-pink text-5xl font-bold">Game Over!</h2>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl font-bold ${isTie ? "text-[#ffdd00]" : "podium-1"}`}
            >
              {isTie ? "It's a tie!" : `Winner: ${winner}`}
            </motion.p>

            <div className="flex flex-col gap-3 w-80">
              {finalScores.map((p, i) => (
                <motion.div
                  key={p.player_id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className={`neon-card flex items-center justify-between px-4 py-3 ${i === 0 ? "podium-1" : i === 1 ? "podium-2" : i === 2 ? "podium-3" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg font-bold">{i + 1}.</span>
                    <span>{p.name}{p.player_id === playerId ? " (you)" : ""}</span>
                  </span>
                  <motion.span
                    className="font-bold text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    {p.score} pts
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="neon-btn neon-btn-pink mt-8 inline-block text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playClick}
            >
              Play Again
            </motion.a>
          </motion.div>
        </main>
      </>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p style={{ color: "rgba(0,240,255,0.6)" }}>Loading...</p>
    </main>
  );
}
