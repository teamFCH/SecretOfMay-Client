"use client";

import { useEffect } from "react";
import { RetroButton } from "@/shared/ui/RetroButton";
import { ArchivePage } from "@/shared/ui/ArchivePage";
import { ARCHIVE_NAME, DEFAULT_DOCUMENT_ID } from "@/shared/config/app";
import { cn } from "@/shared/lib/cn";
import { formatClock } from "@/shared/lib/format";
import type { GameResult } from "@/shared/types/game";

interface ResultViewProps {
  result: GameResult;
  onRestart: () => void;
  onHome: () => void;
  onViewRanking: () => void;
}

function getGrade(result: GameResult): { label: string; sub: string } {
  const { outcome, timeUsed, solvedCount, totalWords } = result;

  if (outcome !== "complete") {
    const pct = Math.round((solvedCount / totalWords) * 100);
    return { label: "미완", sub: `${pct}% 복원` };
  }
  if (timeUsed < 120) return { label: "S", sub: "완벽 복원" };
  if (timeUsed < 300) return { label: "A", sub: "우수 복원" };
  if (timeUsed < 600) return { label: "B", sub: "양호 복원" };
  return { label: "C", sub: "복원 완료" };
}

export function ResultView({ result, onRestart, onHome, onViewRanking }: ResultViewProps) {
  const isComplete = result.outcome === "complete";
  const grade = getGrade(result);

  useEffect(() => {
    if (!isComplete) return;
    fetch("/api/rankings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: result.id,
        playerName: result.playerName,
        timeUsed: result.timeUsed,
        solvedCount: result.solvedCount,
        totalWords: result.totalWords,
        playedAt: result.completedAt,
      }),
    }).catch(() => {});
  }, [result, isComplete]);

  const stampText = isComplete ? "복원\n완료" : result.outcome === "quit" ? "중단" : "미완";
  const stampColor = isComplete ? "text-[#2a5a1a] border-[#2a5a1a]" : "text-blood border-blood";

  return (
    <ArchivePage panelClassName="max-w-[480px]" contentClassName="flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment-muted">
          {ARCHIVE_NAME}
        </p>
        <div className="flex items-start justify-between border-t border-wire/60 pt-2">
          <div>
            <p className="font-mono text-[12px] tracking-[0.2em] text-parchment-muted">
              복원 보고서
            </p>
            <p className="mt-0.5 font-mono text-[12px] tracking-[0.15em] text-parchment-muted/60">
              문서번호 : {DEFAULT_DOCUMENT_ID}
            </p>
          </div>

          <div
            className={cn(
              "shrink-0 rotate-[-6deg] border-2 px-3 py-1 font-mono font-bold tracking-widest",
              stampColor,
            )}
            style={{ lineHeight: 1.2 }}
            aria-label={`등급 ${grade.label}`}
          >
            {grade.label === "미완" ? (
              <span className="text-[15px]">미완</span>
            ) : (
              <span className="text-[24px]">{grade.label}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-3 sm:py-4">
        <div
          className={cn(
            "rotate-[-3deg] border-4 px-5 py-3 sm:px-8 sm:py-4 text-center font-serif text-[30px] sm:text-[36px] font-black leading-tight tracking-[0.15em] whitespace-pre-line opacity-90",
            stampColor,
          )}
        >
          {stampText}
        </div>
      </div>

      <div className="border border-wire/50 divide-y divide-wire/40">
        <StatRow label="복원 요원" value={result.playerName} />
        <StatRow label="소요 시간" value={formatClock(result.timeUsed)} highlight={isComplete} />
        <StatRow
          label="복원 완료"
          value={`${result.solvedCount} / ${result.totalWords}`}
          sub={grade.sub}
          highlight={isComplete}
        />
      </div>

      <p className="ml-2 border-l-2 border-wire/40 pl-3 text-center font-mono text-[12px] leading-[1.9] text-parchment-dim">
        {isComplete
          ? "모든 기록이 복원되었습니다. 역사는 잊히지 않습니다."
          : "기록 복원이 완료되지 않았습니다. 다시 시도하십시오."}
      </p>

      <div className="flex flex-col gap-2 pt-2">
        <RetroButton fullWidth onClick={onRestart}>
          재도전 →
        </RetroButton>
        <RetroButton fullWidth variant="secondary" onClick={onViewRanking}>
          기록 보관소
        </RetroButton>
        <RetroButton fullWidth variant="ghost" onClick={onHome}>
          처음으로
        </RetroButton>
      </div>
    </ArchivePage>
  );
}

function StatRow({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 gap-3 sm:gap-4">
      <span className="font-mono text-[12px] tracking-[0.15em] text-parchment-muted shrink-0">
        {label}
      </span>
      <div className="flex flex-col items-end">
        <span
          className={[
            "font-mono text-[15px] tabular-nums",
            highlight ? "text-parchment" : "text-parchment-dim",
          ].join(" ")}
        >
          {value}
        </span>
        {sub && (
          <span className="font-mono text-[11px] text-parchment-muted/70 tracking-widest">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
