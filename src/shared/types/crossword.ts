export type Direction = "across" | "down";
export type CellPosition = readonly [row: number, col: number];
export type CellKey = `${number},${number}`;

export interface CrosswordEntry {
  id: string;
  number: number;
  direction: Direction;
  startRow: number;
  startCol: number;
  answer: string;
  clue: string;
}

export interface CrosswordPuzzle {
  rows: number;
  cols: number;
  /** `#` = black cell, 나머지 = 정답 글자 */
  answerGrid: string[][];
  /** 각 셀의 클루 번호 */
  numberGrid: (number | null)[][];
  entries: CrosswordEntry[];
}

export interface CrosswordCellState {
  input: string;
  isCorrect: boolean | null;
}
