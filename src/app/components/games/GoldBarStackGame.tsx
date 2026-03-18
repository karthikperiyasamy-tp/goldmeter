"use client";

import { useEffect, useMemo, useState } from "react";

const COLUMN_COUNT = 4;
const MAX_COLUMN_HEIGHT = 8;
const DROP_INTERVAL_MS = 520;
const FAST_DROP_INTERVAL_MS = 90;
const ROW_HEIGHT_PX = 44;

type StackState = number[][];
type ActiveBar = {
  value: number;
  lane: number;
  row: number;
};

function randomBar(): number {
  // Slight bias toward lower values keeps gameplay fair for longer sessions.
  const pool = [8, 8, 16, 16, 24, 24, 32, 40];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getBarClasses(value: number): string {
  const map: Record<number, string> = {
    8: "bg-amber-200 border-amber-300 text-amber-900",
    16: "bg-amber-300 border-amber-400 text-amber-900",
    24: "bg-yellow-300 border-yellow-400 text-yellow-900",
    32: "bg-orange-300 border-orange-400 text-orange-900",
    40: "bg-rose-300 border-rose-400 text-rose-900",
  };
  return map[value] ?? "bg-slate-200 border-slate-300 text-slate-900";
}

function getLandingRow(stacks: StackState, lane: number): number {
  return MAX_COLUMN_HEIGHT - stacks[lane].length - 1;
}

function hasLegalMove(stacks: StackState, incoming: number): boolean {
  return stacks.some((column) => {
    const top = column[column.length - 1];
    return top === incoming || column.length < MAX_COLUMN_HEIGHT;
  });
}

export default function GoldBarStackGame() {
  const [stacks, setStacks] = useState<StackState>(() =>
    Array.from({ length: COLUMN_COUNT }, () => [])
  );
  const [activeBar, setActiveBar] = useState<ActiveBar | null>(() => ({
    value: randomBar(),
    lane: 1,
    row: -1,
  }));
  const [nextBar, setNextBar] = useState<number>(randomBar());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clears, setClears] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFastDropping, setIsFastDropping] = useState(false);
  const [message, setMessage] = useState("Move with <- / -> and match bar weights to clear.");

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("gold-stack-best-score") || "0");
    if (Number.isFinite(stored) && stored > 0) {
      setBestScore(stored);
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      window.localStorage.setItem("gold-stack-best-score", String(score));
    }
  }, [score, bestScore]);

  const totalBars = useMemo(
    () => stacks.reduce((sum, column) => sum + column.length, 0),
    [stacks]
  );

  const spawnBar = (incomingValue: number, lane: number, board: StackState) => {
    if (!hasLegalMove(board, incomingValue)) {
      setActiveBar(null);
      setGameOver(true);
      setMessage("No valid space left. Game over.");
      return;
    }

    setActiveBar({
      value: incomingValue,
      lane: Math.max(0, Math.min(COLUMN_COUNT - 1, lane)),
      row: -1,
    });
  };

  const lockBar = (bar: ActiveBar, board: StackState) => {
    const lane = bar.lane;
    const column = board[lane];
    const top = column[column.length - 1];
    let updatedColumn = column;

    if (top === bar.value) {
      updatedColumn = column.slice(0, -1);
      setScore((prev) => prev + bar.value * 2);
      setClears((prev) => prev + 1);
      setMessage(`Perfect match! ${bar.value}g cleared.`);
    } else if (column.length < MAX_COLUMN_HEIGHT) {
      updatedColumn = [...column, bar.value];
      setScore((prev) => prev + bar.value);
      setMessage(`Placed ${bar.value}g bar.`);
    } else {
      setActiveBar(null);
      setGameOver(true);
      setMessage("Stack is full. Game over.");
      return;
    }

    const updatedStacks = board.map((c, index) => (index === lane ? updatedColumn : c));
    const incoming = nextBar;
    setStacks(updatedStacks);
    setNextBar(randomBar());
    spawnBar(incoming, lane, updatedStacks);
  };

  const stepDrop = () => {
    if (!activeBar || gameOver) return;

    const landingRow = getLandingRow(stacks, activeBar.lane);
    const nextRow = activeBar.row + 1;

    if (nextRow >= landingRow) {
      lockBar(activeBar, stacks);
      return;
    }

    setActiveBar({ ...activeBar, row: nextRow });
  };

  const moveHorizontal = (delta: -1 | 1) => {
    if (!activeBar || gameOver) return;

    const newLane = Math.max(0, Math.min(COLUMN_COUNT - 1, activeBar.lane + delta));
    if (newLane === activeBar.lane) return;

    const movedBar = { ...activeBar, lane: newLane };
    const landingRow = getLandingRow(stacks, newLane);
    if (movedBar.row >= landingRow) {
      lockBar(movedBar, stacks);
      return;
    }

    setActiveBar(movedBar);
  };

  const resetGame = () => {
    const freshBoard = Array.from({ length: COLUMN_COUNT }, () => []);
    const freshCurrent = randomBar();
    const freshUpcoming = randomBar();
    setStacks(freshBoard);
    setActiveBar({
      value: freshCurrent,
      lane: 1,
      row: -1,
    });
    setNextBar(freshUpcoming);
    setScore(0);
    setClears(0);
    setGameOver(false);
    setIsFastDropping(false);
    setMessage("New game started. Move left/right as the bar drops.");
  };

  useEffect(() => {
    if (gameOver || !activeBar) return;
    const timer = window.setInterval(
      stepDrop,
      isFastDropping ? FAST_DROP_INTERVAL_MS : DROP_INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, [activeBar, gameOver, isFastDropping, stacks, nextBar]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        moveHorizontal(-1);
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        moveHorizontal(1);
      }
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        event.preventDefault();
        setIsFastDropping(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        setIsFastDropping(false);
      }
    };

    const handleWindowBlur = () => {
      setIsFastDropping(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [activeBar, stacks, gameOver, nextBar]);

  return (
    <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Gold Bar Stack</h2>
          <p className="text-sm text-slate-600">
            Bars fall from top automatically. Move left/right to place and match.
          </p>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
        >
          Restart
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Score</p>
          <p className="mt-2 text-lg font-bold text-charcoal">{score}</p>
          <p className="text-xs text-slate-500">Best: {bestScore}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Stats</p>
          <p className="mt-2 text-sm font-semibold text-charcoal">Clears: {clears}</p>
          <p className="text-xs text-slate-500">Bars on board: {totalBars}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Next Bar</p>
        <div
          className={`mt-2 rounded-lg border px-3 py-2 text-center text-sm font-bold ${getBarClasses(nextBar)}`}
        >
          {nextBar}g
        </div>
      </div>

      <p
        className={`mt-4 text-sm font-medium ${gameOver ? "text-rose-600" : "text-slate-600"}`}
        aria-live="polite"
      >
        {message}
      </p>

      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
        <div
          className="relative overflow-hidden rounded-xl border border-dashed border-amber-200 bg-white"
          style={{ height: `${MAX_COLUMN_HEIGHT * ROW_HEIGHT_PX + 8}px` }}
        >
          <div className="grid h-full grid-cols-4">
            {stacks.map((column, laneIndex) => (
              <div key={laneIndex} className="relative">
                {column.map((value, barIndex) => (
                  <div
                    key={`${laneIndex}-${barIndex}-${value}`}
                    className={`absolute left-1 right-1 rounded-md border px-2 py-2 text-center text-xs font-bold ${getBarClasses(value)}`}
                    style={{
                      bottom: `${barIndex * ROW_HEIGHT_PX + 4}px`,
                    }}
                  >
                    {value}g
                  </div>
                ))}

                {activeBar && activeBar.lane === laneIndex && (
                  <div
                    className={`absolute left-1 right-1 rounded-md border px-2 py-2 text-center text-xs font-bold shadow-md ${getBarClasses(activeBar.value)}`}
                    style={{
                      top: `${activeBar.row * ROW_HEIGHT_PX + 4}px`,
                    }}
                  >
                    {activeBar.value}g
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => moveHorizontal(-1)}
            disabled={gameOver || !activeBar}
            className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            ← Left
          </button>
          <button
            type="button"
            onMouseDown={() => setIsFastDropping(true)}
            onMouseUp={() => setIsFastDropping(false)}
            onMouseLeave={() => setIsFastDropping(false)}
            onTouchStart={() => setIsFastDropping(true)}
            onTouchEnd={() => setIsFastDropping(false)}
            onTouchCancel={() => setIsFastDropping(false)}
            disabled={gameOver || !activeBar}
            className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            ↓ Down
          </button>
          <button
            type="button"
            onClick={() => moveHorizontal(1)}
            disabled={gameOver || !activeBar}
            className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Right →
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-charcoal">How to play</p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>The gold bar falls from top automatically, step by step.</li>
          <li>Move it to any of 4 positions using arrow keys or buttons.</li>
          <li>Hold down arrow to speed up the fall.</li>
          <li>When it lands on the same weight, that top bar disappears.</li>
          <li>No valid position for the incoming bar means game over.</li>
        </ul>
      </div>
    </section>
  );
}

