import { useEffect, useRef, useState, type CompositionEvent, type KeyboardEvent } from "react";
import type { CrosswordPuzzle } from "@/shared/types/crossword";
import type { CrosswordState, CrosswordActions } from "../model/useCrossword";
import { getCellKey } from "@/features/game/model/crossword";
import sound from "@/shared/lib/sound";

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  actions: CrosswordActions;
}

export function CrosswordGrid({ puzzle, state, actions }: CrosswordGridProps) {
  const { answerGrid, numberGrid, rows, cols } = puzzle;
  const { activeCellKeys, cellGrid, selectedCell, solvedCellKeys, solvedEntries } = state;

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const prevSolvedCount = useRef(0);
  const [composingChar, setComposingChar] = useState("");

  // 셀 선택 시 숨김 input에 포커스 → 한글 IME 조합 가능
  useEffect(() => {
    if (selectedCell) hiddenInputRef.current?.focus();
  }, [selectedCell]);

  useEffect(() => {
    const current = solvedEntries.size;
    if (current > prevSolvedCount.current) {
      if (current === puzzle.entries.length) {
        sound.puzzleComplete();
      } else {
        sound.wordComplete();
      }
    }
    prevSolvedCount.current = current;
  }, [solvedEntries.size, puzzle.entries.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // IME 조합 중에는 compositionEnd가 처리 — 내비게이션 키만 통과
    if (isComposingRef.current) return;
    if (e.key === "Backspace" || e.key === "Delete") sound.tick();
    actions.handleKeyDown(e);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionUpdate = (e: CompositionEvent<HTMLInputElement>) => {
    setComposingChar(e.data ?? "");
  };

  // 한글 조합 완료 → 글자 입력
  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    setComposingChar("");
    const char = e.data?.trim();
    if (char) {
      sound.tick();
      actions.typeCharacter(char);
    }
    e.currentTarget.value = "";
  };

  // 영문 등 비IME 입력 처리 (compositionEnd가 아닌 경우)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    e.currentTarget.value = "";
  };

  const selectedKey = selectedCell ? getCellKey(selectedCell[0], selectedCell[1]) : null;

  const cellClass = (r: number, c: number): string => {
    const key = getCellKey(r, c);
    const isSelected = key === selectedKey;
    const isInActiveEntry = activeCellKeys.has(key);
    const isInSolvedEntry = solvedCellKeys.has(key);

    if (isSelected) return "bg-[#f0c830] border-[#d4aa20] text-[#1a1000] z-10";
    if (isInSolvedEntry) return "bg-[#ddf0c0] border-[#c0dca0] text-[#0a1806]";
    if (isInActiveEntry) return "bg-[#f5f0e4] border-[#ddd4c0] text-[#1a1008]";
    return "bg-cell-bg border-cell-border text-cell-text hover:bg-[#f5f2ea] hover:border-[#ccc4b0]";
  };

  return (
    <div className="relative outline-none select-none" aria-describedby="crossword-grid-help">
      <p id="crossword-grid-help" className="sr-only">
        방향키로 셀을 이동하고, 한글 글자를 입력해 단어를 완성합니다. 같은 칸을 다시 누르면 가로와
        세로 방향이 전환됩니다.
      </p>

      {/* 한글 IME 조합을 위한 숨김 input */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="fixed top-0 w-px h-px opacity-0 pointer-events-none border-0 outline-0 p-0 m-0"
        style={{ left: "-9999px" }}
        aria-hidden="true"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionUpdate={handleCompositionUpdate}
        onCompositionEnd={handleCompositionEnd}
        onChange={handleChange}
      />

      <div
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="크로스워드 퍼즐 그리드"
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const answer = answerGrid[r][c];
            const isBlack = answer === "#";
            const num = numberGrid[r][c];
            const cellState = cellGrid[r][c];

            if (isBlack) {
              return (
                <div
                  key={`${r}-${c}`}
                  className="aspect-square bg-cell-black border border-[#bdb4a0]"
                  aria-hidden="true"
                />
              );
            }

            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "aspect-square relative border cursor-pointer",
                  "flex items-end justify-center pb-[8%]",
                  "transition-colors duration-75",
                  cellClass(r, c),
                ].join(" ")}
                onClick={() => actions.handleCellClick(r, c)}
                role="gridcell"
                aria-selected={selectedKey === getCellKey(r, c)}
                aria-label={`${r + 1}행 ${c + 1}열${cellState.input ? `, 입력 ${cellState.input}` : ""}`}
              >
                {num !== null && (
                  <span className="absolute top-[3%] left-[4%] font-mono text-[clamp(5px,1.2vw,8px)] leading-none text-[#5a4020] font-medium">
                    {num}
                  </span>
                )}
                <span className="font-serif font-bold text-[clamp(11px,2.6vw,20px)] leading-none">
                  {selectedKey === getCellKey(r, c) && composingChar ? composingChar : cellState.input}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
