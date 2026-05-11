import { Redis } from "@upstash/redis";
import type { RankingEntry } from "@/shared/types/ranking";

const kv = Redis.fromEnv();

const SCORES_KEY = "rankings:scores";
const DATA_KEY = "rankings:data";
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

// Lower score = better rank (solvedCount has priority over timeUsed)
function rankScore(entry: RankingEntry): number {
  return -(entry.solvedCount * 1_000_000) + entry.timeUsed;
}

async function ensureSeeded(): Promise<void> {
  const count = await kv.zcard(SCORES_KEY);
  if (count > 0) return;

  const pipeline = kv.pipeline();
  for (const entry of SEED_RANKINGS) {
    pipeline.hset(DATA_KEY, { [entry.id]: entry });
    pipeline.zadd(SCORES_KEY, { member: entry.id, score: rankScore(entry) });
  }
  await pipeline.exec();
}

export async function GET() {
  try {
    await ensureSeeded();

    const ids = await kv.zrange<string[]>(SCORES_KEY, 0, DISPLAY_LIMIT - 1);
    if (ids.length === 0) {
      return Response.json(SEED_RANKINGS.slice(0, DISPLAY_LIMIT));
    }

    const rawEntries = await kv.hmget<Record<string, RankingEntry | null>>(DATA_KEY, ...ids);
    const entries = rawEntries
      ? Object.values(rawEntries).filter((e): e is RankingEntry => e !== null)
      : [];

    return Response.json(
      entries.sort(
        (a, b) =>
          b.solvedCount - a.solvedCount ||
          a.timeUsed - b.timeUsed ||
          Date.parse(a.playedAt) - Date.parse(b.playedAt),
      ),
    );
  } catch {
    return Response.json(SEED_RANKINGS, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
    const entry = body as RankingEntry;

    if (
      typeof entry.id !== "string" ||
      typeof entry.playerName !== "string" ||
      typeof entry.timeUsed !== "number" ||
      typeof entry.solvedCount !== "number" ||
      typeof entry.totalWords !== "number" ||
      typeof entry.playedAt !== "string"
    ) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }

    await ensureSeeded();

    // hsetnx is atomic: returns 1 if newly set, 0 if already existed
    const isNew = await kv.hsetnx(DATA_KEY, entry.id, entry);
    if (!isNew) {
      return Response.json({ ok: true });
    }

    const pipeline = kv.pipeline();
    pipeline.zadd(SCORES_KEY, { member: entry.id, score: rankScore(entry) });
    pipeline.zremrangebyrank(SCORES_KEY, MAX_STORED, -1);
    await pipeline.exec();

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
