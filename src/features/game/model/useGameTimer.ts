import { useCallback, useEffect, useReducer } from "react";
import type { TimerPhase } from "@/shared/types/game";

interface StopwatchState {
  phase: TimerPhase;
  elapsed: number;
}

type StopwatchAction =
  | { type: "start" }
  | { type: "tick" }
  | { type: "markComplete" }
  | { type: "reset"; elapsed?: number };

function createInitialState(initialElapsed = 0): StopwatchState {
  return { phase: "idle", elapsed: initialElapsed };
}

function stopwatchReducer(state: StopwatchState, action: StopwatchAction): StopwatchState {
  switch (action.type) {
    case "start":
      return state.phase === "idle" ? { ...state, phase: "playing" } : state;

    case "tick":
      return state.phase === "playing" ? { ...state, elapsed: state.elapsed + 1 } : state;

    case "markComplete":
      return state.phase === "playing" ? { ...state, phase: "complete" } : state;

    case "reset":
      return createInitialState(action.elapsed);

    default:
      return state;
  }
}

export function useGameTimer(initialElapsed = 0) {
  const [state, dispatch] = useReducer(
    stopwatchReducer,
    initialElapsed,
    createInitialState,
  );

  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setTimeout(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearTimeout(id);
  }, [state.phase, state.elapsed]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const markComplete = useCallback(() => dispatch({ type: "markComplete" }), []);
  const reset = useCallback(
    (elapsed?: number) => dispatch({ type: "reset", elapsed }),
    [],
  );

  return { phase: state.phase, elapsed: state.elapsed, start, markComplete, reset } as const;
}
