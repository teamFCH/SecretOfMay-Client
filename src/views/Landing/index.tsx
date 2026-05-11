"use client";

import { Divider } from "@/shared/ui/Divider";
import { ArchivePage } from "@/shared/ui/ArchivePage";
import { RetroButton } from "@/shared/ui/RetroButton";
import { DocumentHeader } from "@/features/landing/ui/DocumentHeader";
import { FooterText } from "@/features/landing/ui/FooterText";
import { GameTitle } from "@/features/landing/ui/GameTitle";
import { NicknameForm } from "@/features/landing/ui/NicknameForm";

interface LandingViewProps {
  defaultName?: string;
  onStart: (nickname: string) => void;
  onViewRanking: () => void;
}

export function LandingView({ defaultName = "", onStart, onViewRanking }: LandingViewProps) {
  return (
    <ArchivePage panelClassName="max-w-120">
      <DocumentHeader />
      <Divider />
      <GameTitle />
      <Divider />
      <NicknameForm defaultValue={defaultName} onSubmit={onStart} />
      <Divider />
      <FooterText />
      <div className="mt-4 text-center">
        <RetroButton variant="ghost" className="px-4 py-2 text-[9px]" onClick={onViewRanking}>
          기록 보관소 →
        </RetroButton>
      </div>
    </ArchivePage>
  );
}
