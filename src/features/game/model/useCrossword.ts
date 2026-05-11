import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import type {
  CellKey,
  CellPosition,
  CrosswordEntry,
  CrosswordPuzzle,
  Direction,
  CrosswordCellState,
} from "@/shared/types/crossword";
import {
  buildCrosswordPuzzleIndex,
  findEntryAtCell,
  getCellKey,
  getEntryCells,
  isPlayableCell,
  isSupportedAnswerKey,
  normalizeAnswerKey,
} from "@/features/game/model/crossword";

type Grid = CrosswordCellState[][];

function makeEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ input: "", isCorrect: null })),
  );
}

function updateGridCells(
  grid: Grid,
  cells: readonly CellPosition[],
  updater: (cell: CrosswordCellState, position: CellPosition) => CrosswordCellState,
) {
  const nextGrid = [...grid];
  const clonedRows = new Set<number>();

  for (const position of cells) {
    const [row, col] = position;

    if (!clonedRows.has(row)) {
      nextGrid[row] = [...nextGrid[row]];
      clonedRows.add(row);
    }

    nextGrid[row][col] = updater(nextGrid[row][col], position);
  }

  return nextGrid;
}

export interface CrosswordActions {
  handleCellClick: (r: number, c: number) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  typeCharacter: (char: string) => void;
  selectEntry: (entryId: string) => void;
  revealEntry: (entryId: string) => void;
  resetPuzzle: () => void;
}

export interface CrosswordState {
  cellGrid: Grid;
  selectedCell: CellPosition | null;
  direction: Direction;
  activeEntry: CrosswordEntry | null;
  activeCellKeys: Set<CellKey>;
  solvedEntries: Set<string>;
  solvedCellKeys: Set<CellKey>;
  isComplete: boolean;
}

export function useCrossword(
  puzzle: CrosswordPuzzle,
  initialCellGrid?: CrosswordCellState[][],
): [CrosswordState, CrosswordActions] {
  const [cellGrid, setCellGrid] = useState<Grid>(
    () => initialCellGrid ?? makeEmptyGrid(puzzle.rows, puzzle.cols),
  );
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [direction, setDirection] = useState<Direction>("across");
  const puzzleIndex = useMemo(() => buildCrosswordPuzzleIndex(puzzle), [puzzle]);

  const activeEntry = useMemo(() => {
    if (!selectedCell) return null;
    const [row, col] = selectedCell;
    return findEntryAtCell(puzzleIndex, row, col, direction);
  }, [direction, puzzleIndex, selectedCell]);

  const { solvedEntries, solvedCellKeys } = useMemo(() => {
    const solved = new Set<string>();
    const solvedCells = new Set<CellKey>();

    for (const entry of puzzle.entries) {
      const entryCells = puzzleIndex.entryCellsById.get(entry.id) ?? [];
      const isSolved = entryCells.every(
        ([row, col]) => cellGrid[row][col].input === puzzle.answerGrid[row][col],
      );

      if (isSolved) {
        solved.add(entry.id);
        for (const [row, col] of entryCells) {
          solvedCells.add(getCellKey(row, col));
        }
      }
    }

    return {
      solvedEntries: solved,
      solvedCellKeys: solvedCells,
    };
  }, [cellGrid, puzzle, puzzleIndex]);

  const activeCellKeys = useMemo(() => {
    if (!activeEntry) {
      return new Set<CellKey>();
    }

    return new Set(
      (puzzleIndex.entryCellsById.get(activeEntry.id) ?? []).map(([row, col]) =>
        getCellKey(row, col),
      ),
    );
  }, [activeEntry, puzzleIndex]);

  const isComplete = solvedEntries.size === puzzle.entries.length;

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!isPlayableCell(puzzle, row, col)) {
        return;
      }

      if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
        const flipped: Direction = direction === "across" ? "down" : "across";
        if (findEntryAtCell(puzzleIndex, row, col, flipped)) {
          setDirection(flipped);
        }

        return;
      }

      setSelectedCell([row, col]);
      setDirection(findEntryAtCell(puzzleIndex, row, col, direction)?.direction ?? direction);
    },
    [direction, puzzle, puzzleIndex, selectedCell],
  );

  const selectEntry = useCallback(
    (entryId: string) => {
      const entry = puzzleIndex.entryById.get(entryId);
      const cells = puzzleIndex.entryCellsById.get(entryId);

      if (!entry || !cells?.length) {
        return;
      }

      const firstEmptyCell = cells.find(([row, col]) => !cellGrid[row][col].input);
      setSelectedCell(firstEmptyCell ?? cells[0]);
      setDirection(entry.direction);
    },
    [cellGrid, puzzleIndex],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!selectedCell || !activeEntry) return;

      const [row, col] = selectedCell;
      const cells = puzzleIndex.entryCellsById.get(activeEntry.id) ?? [];
      const currentIndex = cells.findIndex(
        ([entryRow, entryCol]) => entryRow === row && entryCol === col,
      );

      if (currentIndex === -1) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();

        if (
          direction !== "across" &&
          findEntryAtCell(puzzleIndex, row, col, "across")?.direction === "across"
        ) {
          setDirection("across");
          return;
        }

        const nextCol = col + (event.key === "ArrowRight" ? 1 : -1);
        if (isPlayableCell(puzzle, row, nextCol)) {
          setSelectedCell([row, nextCol]);
        }

        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();

        if (
          direction !== "down" &&
          findEntryAtCell(puzzleIndex, row, col, "down")?.direction === "down"
        ) {
          setDirection("down");
          return;
        }

        const nextRow = row + (event.key === "ArrowDown" ? 1 : -1);
        if (isPlayableCell(puzzle, nextRow, col)) {
          setSelectedCell([nextRow, col]);
        }

        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();

        if (cellGrid[row][col].input) {
          setCellGrid((previousGrid) =>
            updateGridCells(previousGrid, [[row, col]], () => ({ input: "", isCorrect: null })),
          );
        } else if (currentIndex > 0) {
          const previousCell = cells[currentIndex - 1];
          setCellGrid((previousGrid) =>
            updateGridCells(previousGrid, [previousCell], () => ({ input: "", isCorrect: null })),
          );
          setSelectedCell(previousCell);
        }

        return;
      }

      if (!isSupportedAnswerKey(event.key)) {
        return;
      }

      event.preventDefault();
      const inputCharacter = normalizeAnswerKey(event.key);

      setCellGrid((previousGrid) =>
        updateGridCells(previousGrid, [[row, col]], () => ({
          input: inputCharacter,
          isCorrect: puzzle.answerGrid[row][col] === inputCharacter ? true : null,
        })),
      );

      let nextIndex = currentIndex + 1;

      while (nextIndex < cells.length && cellGrid[cells[nextIndex][0]][cells[nextIndex][1]].input) {
        nextIndex += 1;
      }

      if (nextIndex < cells.length && nextIndex !== currentIndex) {
        setSelectedCell(cells[nextIndex]);
      }
    },
    [activeEntry, cellGrid, direction, puzzle, puzzleIndex, selectedCell],
  );

  const revealEntry = useCallback(
    (entryId: string) => {
      const entryCells = puzzleIndex.entryCellsById.get(entryId);

      if (!entryCells?.length) {
        return;
      }

      setCellGrid((previousGrid) =>
        updateGridCells(previousGrid, entryCells, (_, [row, col]) => ({
          input: puzzle.answerGrid[row][col],
          isCorrect: true,
        })),
      );
    },
    [puzzle, puzzleIndex],
  );

  const resetPuzzle = useCallback(() => {
    setCellGrid(makeEmptyGrid(puzzle.rows, puzzle.cols));
    setSelectedCell(null);
    setDirection("across");
  }, [puzzle]);

  const typeCharacter = useCallback(
    (char: string) => {
      if (!selectedCell || !activeEntry) return;

      const singleChar = char.slice(-1);
      if (!isSupportedAnswerKey(singleChar)) return;

      const inputChar = normalizeAnswerKey(singleChar);
      const [row, col] = selectedCell;
      const cells = puzzleIndex.entryCellsById.get(activeEntry.id) ?? [];
      const currentIndex = cells.findIndex(([r, c]) => r === row && c === col);

      if (currentIndex === -1) return;

      setCellGrid((prev) =>
        updateGridCells(prev, [[row, col]], () => ({
          input: inputChar,
          isCorrect: puzzle.answerGrid[row][col] === inputChar ? true : null,
        })),
      );

      let nextIndex = currentIndex + 1;
      while (nextIndex < cells.length && cellGrid[cells[nextIndex][0]][cells[nextIndex][1]].input) {
        nextIndex++;
      }
      if (nextIndex < cells.length) {
        setSelectedCell(cells[nextIndex]);
      }
    },
    [activeEntry, cellGrid, puzzle, puzzleIndex, selectedCell],
  );

  return [
    {
      cellGrid,
      selectedCell,
      direction,
      activeEntry,
      activeCellKeys,
      solvedEntries,
      solvedCellKeys,
      isComplete,
    },
    { handleCellClick, handleKeyDown, typeCharacter, selectEntry, revealEntry, resetPuzzle },
  ];
}

export { getEntryCells };
