"use client";

import { useRouter } from "next/navigation";
import { LandingView } from "@/views/Landing";
import { writeStorageItem } from "@/shared/lib/storage";
import { PLAYER_STORAGE_KEY } from "@/shared/config/app";

export default function Page() {
  const router = useRouter();
  const handleStart = (nickname: string) => {
    writeStorageItem("local", PLAYER_STORAGE_KEY, nickname);
    router.push("/game");
  };

  return (
    <LandingView
      defaultName=""
      onStart={handleStart}
      onViewRanking={() => router.push("/ranking?from=landing")}
    />
  );
}
