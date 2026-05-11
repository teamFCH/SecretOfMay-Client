import type { CrosswordEntry, CrosswordPuzzle } from "@/shared/types/crossword";

/*
 * 10×10 낱말 퍼즐 (5·18 민주화운동 테마)
 *
 *      0    1    2    3    4    5    6    7    8    9
 *  0 [ 전] [두] [환] [#]  [#]  [#]  [#]  [#]  [#]  [#]
 *  1 [ #]  [#]  [#]  [#]  [시] [#]  [#]  [#]  [#]  [#]
 *  2 [ #]  [계] [엄] [#]  [민] [주]  [화] [#]  [#]  [#]
 *  3 [ #]  [#]  [#]  [#]  [군] [#]  [#]  [#]  [#]  [#]
 *  4 [ #]  [#]  [#]  [#]  [#]  [#]  [#]  [#]  [#]  [#]
 *  5 [ 금] [남] [로] [#]  [#]  [저]  [항] [#]  [#]  [#]
 *  6 [ #]  [#]  [#]  [#]  [#]  [#]  [쟁] [#]  [#]  [#]
 *  7 [ #]  [광] [주] [#]  [#]  [#]  [#]  [#]  [#]  [#]
 *  8 [ #]  [#]  [#]  [도] [청] [#]  [#]  [#]  [#]  [#]
 *  9 [ #]  [#]  [#]  [#]  [#]  [#]  [#]  [#]  [#]  [#]
 *
 *  교차점:
 *    (2,4) 민 — 4-ACROSS(민주화) × 2-DOWN(시민군)
 *    (5,6) 항 — 6-ACROSS(저항)   × 7-DOWN(항쟁)
 */

const ROWS = 10;
const COLS = 10;

const B = "#";

export const ANSWER_GRID: string[][] = [
  ["전", "두", "환", B, B, B, B, B, B, B],
  [B, B, B, B, "시", B, B, B, B, B],
  [B, "계", "엄", B, "민", "주", "화", B, B, B],
  [B, B, B, B, "군", B, B, B, B, B],
  [B, B, B, B, B, B, B, B, B, B],
  ["금", "남", "로", B, B, "저", "항", B, B, B],
  [B, B, B, B, B, B, "쟁", B, B, B],
  [B, "광", "주", B, B, B, B, B, B, B],
  [B, B, B, "도", "청", B, B, B, B, B],
  [B, B, B, B, B, B, B, B, B, B],
];

const ENTRIES_RAW = [
  {
    number: 1,
    direction: "across",
    startRow: 0,
    startCol: 0,
    answer: "전두환",
    clue: "12·12 군사반란을 주도한 신군부의 핵심 인물. 비상계엄 확대 선포 후 광주 시민 저항을 공수부대로 무력 진압하였다.",
  },
  {
    number: 2,
    direction: "down",
    startRow: 1,
    startCol: 4,
    answer: "시민군",
    clue: "광주 시민들이 계엄군의 폭력에 맞서 스스로 조직한 무장 자위대. 도청을 사수하며 끝까지 민주주의를 지키고자 했다.",
  },
  {
    number: 3,
    direction: "across",
    startRow: 2,
    startCol: 1,
    answer: "계엄",
    clue: "신군부는 1980년 5월 17일 비상계엄을 전국으로 확대 선포하였다. 이는 광주 시민들 저항의 직접적 도화선이 되었다.",
  },
  {
    number: 4,
    direction: "across",
    startRow: 2,
    startCol: 4,
    answer: "민주화",
    clue: "5·18 광주민주화운동은 대한민국 민주주의 발전의 중요한 전환점이었다. 시민들의 희생은 1987년 6월 민주항쟁의 정신적 토대가 되었다.",
  },
  {
    number: 5,
    direction: "across",
    startRow: 5,
    startCol: 0,
    answer: "금남로",
    clue: "광주 시내 중심 대로. 5·18 당시 수만 명의 시민이 민주화를 외친 항쟁의 거리이며 계엄군과의 충돌이 격렬하게 벌어진 곳이다.",
  },
  {
    number: 6,
    direction: "across",
    startRow: 5,
    startCol: 5,
    answer: "저항",
    clue: "부당한 권력에 맞서 굴하지 않는 행동. 광주 시민들은 계엄군의 폭력에도 굴하지 않고 끝까지 민주주의 수호를 위해 싸웠다.",
  },
  {
    number: 7,
    direction: "down",
    startRow: 5,
    startCol: 6,
    answer: "항쟁",
    clue: "불의에 맞서 싸우는 저항운동. 5·18은 단순한 폭동이 아닌 정당한 민주화 항쟁으로, 2011년 유네스코 세계기록유산에 등재되었다.",
  },
  {
    number: 8,
    direction: "across",
    startRow: 7,
    startCol: 1,
    answer: "광주",
    clue: "전라남도의 주요 도시. 1980년 5월 민주화운동의 중심지로, 대한민국 민주주의 역사의 성지가 되었다.",
  },
  {
    number: 9,
    direction: "across",
    startRow: 8,
    startCol: 3,
    answer: "도청",
    clue: "전라남도청은 5·18 민주화운동의 최후 항쟁지. 시민군은 5월 27일 새벽 계엄군의 진압 작전에 맞서 끝까지 이곳을 지켰다.",
  },
] satisfies ReadonlyArray<Omit<CrosswordEntry, "id">>;

function buildEntries(): CrosswordEntry[] {
  return ENTRIES_RAW.map((entry) => ({ ...entry, id: `${entry.number}-${entry.direction}` }));
}

function buildNumberGrid(): (number | null)[][] {
  const grid: (number | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (const e of ENTRIES_RAW) {
    if (grid[e.startRow][e.startCol] === null) {
      grid[e.startRow][e.startCol] = e.number;
    }
  }
  return grid;
}

export const CROSSWORD_PUZZLE: CrosswordPuzzle = {
  rows: ROWS,
  cols: COLS,
  answerGrid: ANSWER_GRID,
  numberGrid: buildNumberGrid(),
  entries: buildEntries(),
};
