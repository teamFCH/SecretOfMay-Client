"use client";

import { useCallback, useEffect, useRef } from "react";
import { createClientId } from "@/shared/lib/id";
import { CRTScreen } from "@/shared/ui/CRTScreen";
import { RetroButton } from "@/shared/ui/RetroButton";
import { CROSSWORD_PUZZLE } from "@/features/game/constants/crosswordData";
import { useCrossword } from "@/features/game/model/useCrossword";
import { useGameTimer } from "@/features/game/model/useGameTimer";
import { CrosswordClueList } from "@/features/game/ui/CrosswordClueList";
import { CrosswordGrid } from "@/features/game/ui/CrosswordGrid";
import { GameControls } from "@/features/game/ui/GameControls";
import { GameHeader } from "@/features/game/ui/GameHeader";
import type { GameResult } from "@/shared/types/game";

interface GameViewProps {
  playerName: string;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function GameView({ playerName, onComplete, onQuit }: GameViewProps) {
  const [crosswordState, crosswordActions] = useCrossword(CROSSWORD_PUZZLE);
  const { elapsed, markComplete, phase, start } = useGameTimer();
  const completionTimeoutRef = useRef<number | null>(null);

  const totalWords = CROSSWORD_PUZZLE.entries.length;
  const foundCount = crosswordState.solvedEntries.size;
  const isPlaying = phase === "playing";

  useEffect(() => {
    if (crosswordState.isComplete && isPlaying) {
      markComplete();
    }
  }, [crosswordState.isComplete, isPlaying, markComplete]);

  const finalizeGameRef = useRef<() => void>(() => {});
  finalizeGameRef.current = () => {
    onComplete({
      id: createClientId("game-result"),
      playerName,
      outcome: "complete",
      timeUsed: elapsed,
      solvedCount: crosswordState.solvedEntries.size,
      totalWords,
      completedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (phase !== "complete") return;

    completionTimeoutRef.current = window.setTimeout(() => {
      finalizeGameRef.current();
    }, 700);

    return () => {
      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, [phase]);

  const handleQuit = useCallback(() => {
    onQuit();
  }, [onQuit]);

  return (
    <CRTScreen>
      <div className="flex min-h-screen flex-col">
        <GameHeader
          playerName={playerName}
          elapsed={elapsed}
          foundCount={foundCount}
          totalWords={totalWords}
          phase={phase}
        />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 px-2 py-3 sm:gap-4 sm:px-3 sm:py-4 md:flex-row">
          <div className="flex flex-col gap-2 md:flex-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] uppercase tracking-[0.28em] text-parchment-muted">
                낱말 퍼즐
              </span>
              <span className="font-mono text-[12px] tracking-[0.15em] text-parchment-muted">
                {foundCount}/{totalWords} 복원
              </span>
            </div>

            <div className="relative border-2 border-wire bg-cell-black p-0.5">
              <div className={isPlaying ? "" : "pointer-events-none opacity-40"}>
                <CrosswordGrid
                  puzzle={CROSSWORD_PUZZLE}
                  state={crosswordState}
                  actions={crosswordActions}
                />
              </div>

              {phase === "idle" && (
                <div className="absolute inset-0 flex items-center justify-center bg-paper/85 backdrop-blur-[1px]">
                  <div className="flex max-w-60 flex-col items-center gap-4 px-6 text-center">
                    <p className="font-mono text-[12px] uppercase tracking-[0.28em] text-parchment-muted">
                      복원 대기 중
                    </p>
                    <p className="font-serif text-[16px] leading-relaxed text-parchment">
                      1980년 5월, 광주의 기록을 복원하십시오.
                    </p>
                    <RetroButton onClick={start}>기록 복원 시작 →</RetroButton>
                  </div>
                </div>
              )}
            </div>

            <p className="text-center font-mono text-[12px] tracking-widest text-parchment-muted/60">
              칸 클릭 후 한글 입력 · 재클릭으로 가로↔세로 전환
            </p>
          </div>

          <div className="flex flex-col gap-3 md:w-72 lg:w-80 xl:w-96">
            <div className="flex flex-col overflow-hidden border border-wire bg-paper/40 max-h-48 sm:max-h-60 md:max-h-none md:flex-1">
              <div className="flex shrink-0 items-center justify-between border-b border-wire/50 px-3 py-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-parchment-muted">
                  단서
                </span>
                <span className="font-mono text-[10px] text-parchment-dim">
                  {foundCount}
                  <span className="text-parchment-muted">/{totalWords}</span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <CrosswordClueList
                  entries={CROSSWORD_PUZZLE.entries}
                  state={crosswordState}
                  actions={crosswordActions}
                />
              </div>
            </div>

            <div className="hidden md:block">
              <GameControls onQuit={handleQuit} disabled={!isPlaying} />
            </div>
          </div>
        </div>

        <div className="border-t border-wire bg-paper/95 px-4 py-3 md:hidden">
          <GameControls onQuit={handleQuit} disabled={!isPlaying} />
        </div>
      </div>
    </CRTScreen>
  );
}
