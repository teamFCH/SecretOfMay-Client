"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RankingView } from "@/views/Ranking";
import type { RankingEntry } from "@/shared/types/ranking";

function RankingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "landing";
  const currentPlayer = searchParams.get("player") ?? undefined;

  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    fetch("/api/rankings")
      .then((res) => res.json())
      .then((data: RankingEntry[]) => setRankings(data))
      .catch(() => {});
  }, []);

  const handleBack = () => {
    if (from === "result") {
      router.push("/result");
    } else {
      router.push("/");
    }
  };

  return (
    <RankingView rankings={rankings} currentPlayer={currentPlayer} onBack={handleBack} />
  );
}

export default function RankingPage() {
  return (
    <Suspense>
      <RankingPageContent />
    </Suspense>
  );
}
