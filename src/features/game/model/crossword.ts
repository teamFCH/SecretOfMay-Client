import type {
  CellKey,
  CellPosition,
  CrosswordEntry,
  CrosswordPuzzle,
  Direction,
} from "@/shared/types/crossword";

export interface CrosswordPuzzleIndex {
  cellEntriesByKey: Map<CellKey, CrosswordEntry[]>;
  entryById: Map<string, CrosswordEntry>;
  entryCellsById: Map<string, CellPosition[]>;
}

export function getCellKey(row: number, col: number): CellKey {
  return `${row},${col}`;
}

export function getEntryCells(entry: CrosswordEntry): CellPosition[] {
  return Array.from({ length: entry.answer.length }, (_, index) =>
    entry.direction === "across"
      ? [entry.startRow, entry.startCol + index]
      : [entry.startRow + index, entry.startCol],
  );
}

export function buildCrosswordPuzzleIndex(puzzle: CrosswordPuzzle): CrosswordPuzzleIndex {
  const entryById = new Map<string, CrosswordEntry>();
  const entryCellsById = new Map<string, CellPosition[]>();
  const cellEntriesByKey = new Map<CellKey, CrosswordEntry[]>();

  for (const entry of puzzle.entries) {
    const cells = getEntryCells(entry);
    entryById.set(entry.id, entry);
    entryCellsById.set(entry.id, cells);

    for (const [row, col] of cells) {
      const key = getCellKey(row, col);
      const currentEntries = cellEntriesByKey.get(key) ?? [];
      currentEntries.push(entry);
      cellEntriesByKey.set(key, currentEntries);
    }
  }

  return {
    cellEntriesByKey,
    entryById,
    entryCellsById,
  };
}

export function findEntryAtCell(
  index: CrosswordPuzzleIndex,
  row: number,
  col: number,
  preferredDirection: Direction,
) {
  const entries = index.cellEntriesByKey.get(getCellKey(row, col)) ?? [];
  return (
    entries.find((entry) => entry.direction === preferredDirection) ??
    entries.find((entry) => entry.direction !== preferredDirection) ??
    null
  );
}

export function isPlayableCell(puzzle: CrosswordPuzzle, row: number, col: number) {
  return puzzle.answerGrid[row]?.[col] !== "#";
}

export function isSupportedAnswerKey(key: string) {
  return /^[가-힣]$/.test(key) || /^[a-zA-Z]$/.test(key);
}

export function normalizeAnswerKey(key: string) {
  return /^[a-zA-Z]$/.test(key) ? key.toUpperCase() : key;
}

export function getDirectionLabel(direction: Direction) {
  return direction === "across" ? "가로" : "세로";
}
