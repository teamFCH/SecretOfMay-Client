import { Redis } from "@upstash/redis";

const kv = Redis.fromEnv();
import type { RankingEntry } from "@/shared/types/ranking";

const KV_KEY = "rankings";
const MAX_STORED = 100;
const DISPLAY_LIMIT = 20;

const SEED_RANKINGS: RankingEntry[] = [
  {
    id: "seed-yoon-sangwon",
    playerName: "윤상원",
    timeUsed: 198,
    solvedCount: 9,
    totalWords: 9,
    playedAt: "2026-05-01T09:14:00.000Z",
  },
  {
    id: "seed-park-gwanhyeon",
    playerName: "박관현",
    timeUsed: 247,
    solvedCount: 9,
    totalWords: 9,
    playedAt: "2026-05-02T14:32:00.000Z",
  },
  {
    id: "seed-lee-yanghyeon",
    playerName: "이양현",
    timeUsed: 312,
    solvedCount: 9,
    totalWords: 9,
    playedAt: "2026-05-03T11:05:00.000Z",
  },
  {
    id: "seed-jeong-sangyong",
    playerName: "정상용",
    timeUsed: 378,
    solvedCount: 9,
    totalWords: 9,
    playedAt: "2026-05-04T08:47:00.000Z",
  },
  {
    id: "seed-owol-ui-bit",
    playerName: "오월의빛",
    timeUsed: 445,
    solvedCount: 9,
    totalWords: 9,
    playedAt: "2026-05-05T16:20:00.000Z",
  },
];

function sortRankings(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.solvedCount - a.solvedCount ||
      a.timeUsed - b.timeUsed ||
      Date.parse(a.playedAt) - Date.parse(b.playedAt),
  );
}

async function loadRankings(): Promise<RankingEntry[]> {
  const stored = await kv.get<RankingEntry[]>(KV_KEY);
  if (stored && stored.length > 0) return stored;

  await kv.set(KV_KEY, SEED_RANKINGS);
  return SEED_RANKINGS;
}

export async function GET() {
  try {
    const rankings = await loadRankings();
    return Response.json(sortRankings(rankings).slice(0, DISPLAY_LIMIT));
  } catch {
    return Response.json(SEED_RANKINGS, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = (await request.json()) as RankingEntry;

    if (
      typeof entry.id !== "string" ||
      typeof entry.playerName !== "string" ||
      typeof entry.timeUsed !== "number"
    ) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }

    const rankings = await loadRankings();

    if (rankings.some((e) => e.id === entry.id)) {
      return Response.json({ ok: true });
    }

    const updated = sortRankings([...rankings, entry]).slice(0, MAX_STORED);
    await kv.set(KV_KEY, updated);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
