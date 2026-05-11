import type { TimerPhase } from "@/shared/types/game";
import { ARCHIVE_NAME, DEFAULT_DOCUMENT_ID } from "@/shared/config/app";
import { formatClock } from "@/shared/lib/format";
import { MuteButton } from "@/shared/ui/MuteButton";

interface GameHeaderProps {
  playerName: string;
  elapsed: number;
  foundCount: number;
  totalWords: number;
  phase: TimerPhase;
}

export function GameHeader({ playerName, elapsed, foundCount, totalWords, phase }: GameHeaderProps) {
  const progress = totalWords > 0 ? foundCount / totalWords : 0;
  const isIdle = phase === "idle";

  return (
    <header className="sticky top-0 z-20 border-b border-wire bg-paper/95 backdrop-blur-sm">
      <div className="border-b border-wire/40 px-4 py-1 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-parchment-muted">
          {ARCHIVE_NAME}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.15em] text-parchment-muted">
            문서번호 : {DEFAULT_DOCUMENT_ID}
          </span>
          <MuteButton />
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 shrink-0">
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-parchment-muted">
            복원 요원
          </span>
          <span className="font-mono text-[12px] tracking-wider text-parchment">{playerName}</span>
        </div>

        <div className="flex-1 max-w-xs flex flex-col gap-1.5 items-center">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 flex gap-px">
              {Array.from({ length: totalWords }, (_, i) => (
                <div
                  key={i}
                  className={[
                    "flex-1 h-1.5 transition-colors duration-500",
                    i < foundCount ? "bg-blood" : "bg-wire",
                  ].join(" ")}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] tabular-nums shrink-0">
              <span className="text-parchment">{foundCount}</span>
              <span className="text-parchment-muted">/{totalWords}</span>
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-parchment-muted">
            복원 완료
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end shrink-0">
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-parchment-muted">
            {isIdle ? "대기 중" : "경과 시간"}
          </span>
          <span
            className="font-mono text-[22px] leading-none tabular-nums text-parchment transition-colors duration-300"
            aria-live="polite"
          >
            {formatClock(elapsed, " : ")}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-wire/40 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blood/60 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}
