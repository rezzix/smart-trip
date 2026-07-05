import { create } from "zustand";

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface QuestionData {
  question_index: number;
  total: number;
  text: string;
  choices: string[];
  time_remaining: number;
}

export interface RoundResult {
  correct_answer: number;
  explanation: string;
  results: { player_id: string; name: string; score: number; correct: boolean }[];
}

export interface FinalScore {
  player_id: string;
  name: string;
  score: number;
}

type Screen = "landing" | "lobby" | "question" | "results";

interface GameState {
  screen: Screen;
  playerId: string;
  playerName: string;
  playerAge: number;
  gameId: string;
  isHost: boolean;
  players: Player[];
  question: QuestionData | null;
  roundResult: RoundResult | null;
  finalScores: FinalScore[];
  winner: string | null;
  isTie: boolean;
  error: string | null;
  ws: WebSocket | null;

  setPlayerInfo: (name: string, age: number) => void;
  setGameId: (id: string) => void;
  setIsHost: (v: boolean) => void;
  setScreen: (s: Screen) => void;
  setPlayers: (p: Player[]) => void;
  setQuestion: (q: QuestionData | null) => void;
  setRoundResult: (r: RoundResult | null) => void;
  setFinalScores: (scores: FinalScore[], winner: string) => void;
  setError: (e: string | null) => void;
  connectWs: (gameId: string, playerId: string) => void;
  sendMessage: (type: string, payload?: Record<string, unknown>) => void;
  reset: () => void;
}

const initialState = {
  screen: "landing" as Screen,
  playerId: "",
  playerName: "",
  playerAge: 0,
  gameId: "",
  isHost: false,
  players: [] as Player[],
  question: null as QuestionData | null,
  roundResult: null as RoundResult | null,
  finalScores: [] as FinalScore[],
  winner: null as string | null,
  isTie: false,
  error: null as string | null,
  ws: null as WebSocket | null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setPlayerInfo: (name, age) => set({ playerName: name, playerAge: age }),
  setGameId: (id) => set({ gameId: id }),
  setIsHost: (v) => set({ isHost: v }),
  setScreen: (s) => set({ screen: s }),
  setPlayers: (p) => set({ players: p }),
  setQuestion: (q) => set({ question: q, roundResult: null }),
  setRoundResult: (r) => set({ roundResult: r }),
  setFinalScores: (scores, winner) => set({ finalScores: scores, winner }),
  setError: (e) => set({ error: e }),

  connectWs: (gameId, playerId) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/game/${gameId}/${playerId}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "player_joined":
          set((s) => ({
            players: s.players.some((p) => p.id === msg.payload.player_id)
              ? s.players
              : [...s.players, { id: msg.payload.player_id, name: msg.payload.name, score: 0 }],
          }));
          break;
        case "player_left":
          set((s) => ({
            players: s.players.filter((p) => p.id !== msg.payload.player_id),
          }));
          break;
        case "game_started":
          set({ players: msg.payload.players, screen: "question" });
          break;
        case "question":
          set({ question: msg.payload, roundResult: null });
          break;
        case "question_result":
          set({ roundResult: msg.payload });
          break;
        case "round_end":
          set({ finalScores: msg.payload.final_scores, winner: msg.payload.winner, isTie: msg.payload.is_tie ?? false, screen: "results" });
          break;
        case "error":
          set({ error: msg.payload.code });
          break;
      }
    };

    set({ ws });
  },

  sendMessage: (type, payload = {}) => {
    const ws = get().ws;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  },

  reset: () => set(initialState),
}));
