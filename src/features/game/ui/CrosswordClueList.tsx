import { useMemo } from "react";
import type { CrosswordEntry } from "@/shared/types/crossword";
import { getDirectionLabel } from "@/features/game/model/crossword";
import type { CrosswordState, CrosswordActions } from "../model/useCrossword";

interface CrosswordClueListProps {
  entries: CrosswordEntry[];
  state: CrosswordState;
  actions: CrosswordActions;
}

function ClueSection({
  directionLabel,
  entries,
  activeId,
  solvedEntries,
  onSelect,
}: {
  directionLabel: string;
  entries: CrosswordEntry[];
  activeId: string | null;
  solvedEntries: Set<string>;
  onSelect: (entry: CrosswordEntry) => void;
}) {
  return (
    <section className="flex flex-col gap-0.5" aria-label={`${directionLabel} 단서`}>
      <div className="border-b border-wire/40 px-1 pb-1 font-mono text-[9px] uppercase tracking-[0.3em] text-parchment-muted">
        {directionLabel}
      </div>
      {entries.map((entry) => {
        const isSolved = solvedEntries.has(entry.id);
        const isActive = entry.id === activeId;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry)}
            className={[
              "text-left flex gap-2 px-2 py-1.5 transition-colors duration-100 border-l-2",
              isActive
                ? "bg-blood/15 border-blood text-parchment"
                : isSolved
                  ? "border-transparent text-[#4a8020] opacity-80"
                  : "border-transparent text-parchment-dim hover:text-parchment hover:bg-wire/30 hover:border-wire",
            ].join(" ")}
            aria-pressed={isActive}
            aria-label={`${entry.number}. ${entry.clue}${isSolved ? " (완성됨)" : ""}`}
          >
            <span className="font-mono text-[10px] shrink-0 w-4 text-right text-parchment-muted">
              {entry.number}
            </span>
            <span
              className={[
                "font-mono text-[10px] leading-[1.75]",
                isSolved ? "line-through" : "",
              ].join(" ")}
            >
              {entry.clue}
            </span>
          </button>
        );
      })}
    </section>
  );
}

export function CrosswordClueList({ entries, state, actions }: CrosswordClueListProps) {
  const activeId = state.activeEntry?.id ?? null;
  const groupedEntries = useMemo(
    () => ({
      across: entries.filter((entry) => entry.direction === "across"),
      down: entries.filter((entry) => entry.direction === "down"),
    }),
    [entries],
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <ClueSection
        directionLabel={getDirectionLabel("across")}
        entries={groupedEntries.across}
        activeId={activeId}
        solvedEntries={state.solvedEntries}
        onSelect={(entry) => actions.selectEntry(entry.id)}
      />
      <ClueSection
        directionLabel={getDirectionLabel("down")}
        entries={groupedEntries.down}
        activeId={activeId}
        solvedEntries={state.solvedEntries}
        onSelect={(entry) => actions.selectEntry(entry.id)}
      />
    </div>
  );
}
