import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { formatArchiveDate, formatClock } from "@/shared/lib/format";
import type { RankingEntry } from "@/shared/types/ranking";

interface RankingTableProps {
  rankings: RankingEntry[];
  currentPlayer?: string;
}

function getRankColor(rank: number) {
  if (rank === 1) return "text-blood-bright";
  if (rank === 2) return "text-parchment";
  if (rank === 3) return "text-parchment-dim";
  return "text-parchment-muted";
}

export function RankingTable({ rankings, currentPlayer }: RankingTableProps) {
  if (rankings.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[11px] tracking-[0.15em] text-parchment-muted">
          아직 기록된 복원 요원이 없습니다
        </p>
        <p className="mt-2 font-mono text-[9px] tracking-[0.1em] text-parchment-muted/50">
          퍼즐을 완료하면 이 명단에 등록됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-wire/40">
      <table className="w-full border-collapse table-fixed">
        <caption className="sr-only">복원 완료자 랭킹</caption>
        <thead>
          <tr className="border-b-2 border-wire/60">
            <HeaderCell className="w-12">순위</HeaderCell>
            <HeaderCell>요원명</HeaderCell>
            <HeaderCell className="w-20 text-right">기록</HeaderCell>
            <HeaderCell className="w-24 text-right">날짜</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry, index) => {
            const rank = index + 1;
            const colorClassName = getRankColor(rank);
            const isCurrentPlayer = Boolean(currentPlayer) && entry.playerName === currentPlayer;
            const isEmphasized = rank <= 3 || isCurrentPlayer;

            return (
              <tr
                key={entry.id}
                className={cn(
                  "border-b border-wire/30 align-top",
                  rank === 1 && "shadow-[inset_2px_0_0_#8b1a1a]",
                  isCurrentPlayer && "bg-blood/[0.04]",
                )}
              >
                <BodyCell className={cn("tabular-nums", colorClassName)}>
                  {String(rank).padStart(2, "0")}
                </BodyCell>
                <BodyCell
                  className={cn(
                    "truncate font-serif text-[12px]",
                    colorClassName,
                    isEmphasized && "font-bold",
                  )}
                >
                  {entry.playerName}
                  {isCurrentPlayer && (
                    <span className="ml-1.5 font-mono text-[8px] tracking-[0.1em] text-parchment-muted not-italic">
                      ← 나
                    </span>
                  )}
                </BodyCell>
                <BodyCell className={cn("text-right tabular-nums", colorClassName)}>
                  {formatClock(entry.timeUsed)}
                </BodyCell>
                <BodyCell className={cn("text-right tabular-nums text-[10px]", colorClassName)}>
                  {formatArchiveDate(entry.playedAt)}
                </BodyCell>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-1 border-t border-wire/40 px-3 pt-2">
        <p className="text-right font-mono text-[9px] tracking-[0.1em] text-parchment-muted/50">
          총 {rankings.length}명 등재
        </p>
      </div>
    </div>
  );
}

function HeaderCell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 pb-2.5 text-left font-mono text-[9px] tracking-[0.2em] text-parchment-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

function BodyCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-3 py-2.5 font-mono text-[11px]", className)}>{children}</td>;
}
