"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameView } from "@/views/Game";
import { readStorageItem, writeStorageItem } from "@/shared/lib/storage";
import { PLAYER_STORAGE_KEY, LATEST_RESULT_STORAGE_KEY } from "@/shared/config/app";
import type { GameResult } from "@/shared/types/game";

export default function GamePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const name = readStorageItem("local", PLAYER_STORAGE_KEY);
    if (!name) {
      router.replace("/");
      return;
    }
    setPlayerName(name);
    setReady(true);
  }, [router]);

  const handleComplete = (result: GameResult) => {
    writeStorageItem("local", LATEST_RESULT_STORAGE_KEY, JSON.stringify(result));
    router.push("/result");
  };

  const handleQuit = () => {
    router.push("/");
  };

  if (!ready) return null;

  return (
    <GameView
      playerName={playerName}
      onComplete={handleComplete}
      onQuit={handleQuit}
    />
  );
}
