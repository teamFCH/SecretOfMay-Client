export type GameOutcome = "complete" | "quit";

export type TimerPhase = "idle" | "playing" | "complete";

export interface GameResult {
  id: string;
  playerName: string;
  outcome: GameOutcome;
  timeUsed: number;
  solvedCount: number;
  totalWords: number;
  completedAt: string;
}
