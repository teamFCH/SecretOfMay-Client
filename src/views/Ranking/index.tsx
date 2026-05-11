"use client";

import { RankingTable } from "@/features/ranking/ui/RankingTable";
import { ArchivePage } from "@/shared/ui/ArchivePage";
import { ARCHIVE_NAME, RANKING_DOCUMENT_ID } from "@/shared/config/app";
import { RetroButton } from "@/shared/ui/RetroButton";
import type { RankingEntry } from "@/shared/types/ranking";

interface RankingViewProps {
  rankings: RankingEntry[];
  currentPlayer?: string;
  onBack: () => void;
}

export function RankingView({ rankings, currentPlayer, onBack }: RankingViewProps) {
  return (
    <ArchivePage panelClassName="max-w-[580px]" contentClassName="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment-muted">
          {ARCHIVE_NAME}
        </p>
        <div className="flex items-start justify-between gap-4 border-t border-wire/60 pt-3">
          <div>
            <h1 className="font-serif text-[22px] sm:text-[26px] font-black tracking-[0.15em] text-parchment">
              복원 완료자 명단
            </h1>
            <p className="mt-1 font-mono text-[12px] tracking-[0.12em] text-parchment-muted/60">
              문서번호 : {RANKING_DOCUMENT_ID}
            </p>
          </div>

          <div
            className="shrink-0 rotate-[4deg] border border-blood/50 px-3 py-1.5 font-mono text-[13px] tracking-[0.25em] text-blood/60"
            aria-hidden="true"
          >
            열람
          </div>
        </div>
      </div>

      <div className="relative border-t border-wire/50">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper px-3 font-mono text-[11px] text-parchment-muted/50">
          · · ·
        </span>
      </div>

      <p className="border-l border-wire/40 pl-3 font-mono text-[11px] leading-[1.8] text-parchment-muted/70">
        아래는 오월의 기록을 복원하는 데 성공한 요원들의 명단입니다.
        <br />
        기록 시간이 짧을수록 상위에 등재됩니다.
      </p>

      <RankingTable rankings={rankings} currentPlayer={currentPlayer} />

      <div className="pt-1">
        <RetroButton fullWidth variant="secondary" onClick={onBack}>
          돌아가기
        </RetroButton>
      </div>
    </ArchivePage>
  );
}
