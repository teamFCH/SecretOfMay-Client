"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultView } from "@/views/Result";
import { readJsonStorage, removeStorageItem } from "@/shared/lib/storage";
import { LATEST_RESULT_STORAGE_KEY } from "@/shared/config/app";
import type { GameResult } from "@/shared/types/game";

function isGameResult(value: unknown): value is GameResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.playerName === "string" &&
    typeof v.outcome === "string" &&
    typeof v.timeUsed === "number" &&
    typeof v.hintsUsed === "number" &&
    typeof v.solvedCount === "number" &&
    typeof v.totalWords === "number" &&
    typeof v.completedAt === "string"
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    const saved = readJsonStorage("local", LATEST_RESULT_STORAGE_KEY, isGameResult);
    if (!saved) {
      router.replace("/");
      return;
    }
    setResult(saved);
  }, [router]);

  if (!result) return null;

  const handleRestart = () => {
    removeStorageItem("local", LATEST_RESULT_STORAGE_KEY);
    router.push("/game");
  };

  const handleHome = () => {
    removeStorageItem("local", LATEST_RESULT_STORAGE_KEY);
    router.push("/");
  };

  return (
    <ResultView
      result={result}
      onRestart={handleRestart}
      onHome={handleHome}
      onViewRanking={() => router.push(`/ranking?from=result&id=${encodeURIComponent(result.id)}`)}
    />
  );
}
