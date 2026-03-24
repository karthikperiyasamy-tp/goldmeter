"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COLUMN_COUNT = 4;
const ROW_HEIGHT_PX = 44;

/**
 * Per-level tuning. Level number is uncapped — you can keep leveling up.
 * Difficulty plateaus: drop speed hits a floor (~level 11+), clears-to-advance caps at 14,
 * fast-drop and bar pools stop changing after their thresholds.
 */
function getLevelConfig(level: number) {
  const lv = Math.max(1, level);
  const dropIntervalMs = Math.max(260, 540 - (lv - 1) * 28);
  const fastDropIntervalMs = Math.max(55, 95 - Math.min(lv - 1, 8) * 4);
  const clearsToAdvance = Math.min(14, 3 + lv * 2);
  const maxColumnHeight = 8;
  return { dropIntervalMs, fastDropIntervalMs, clearsToAdvance, maxColumnHeight };
}

function randomBarForLevel(level: number): number {
  if (level <= 2) {
    const pool = [8, 8, 16, 16, 24, 24, 32, 40];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (level <= 4) {
    const pool = [8, 16, 16, 24, 24, 32, 32, 40, 40];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const pool = [8, 16, 24, 24, 32, 32, 40, 40, 40];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Prevents mobile long-press text selection / copy-cut UI on game controls */
const MOBILE_CONTROL_PAD_CLASS =
  "select-none touch-manipulation cursor-pointer [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]";
const MOBILE_CONTROL_BTN_CLASS = `${MOBILE_CONTROL_PAD_CLASS} rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60`;

type StackState = number[][];
type ActiveBar = {
  value: number;
  lane: number;
  row: number;
};

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

function getLandingRow(stacks: StackState, lane: number, maxColumnHeight: number): number {
  return maxColumnHeight - stacks[lane].length - 1;
}

function hasLegalMove(
  stacks: StackState,
  incoming: number,
  maxColumnHeight: number
): boolean {
  return stacks.some((column) => {
    const top = column[column.length - 1];
    return top === incoming || column.length < maxColumnHeight;
  });
}

export default function GoldBarStackGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [clearsInLevel, setClearsInLevel] = useState(0);
  const [stacks, setStacks] = useState<StackState>(() =>
    Array.from({ length: COLUMN_COUNT }, () => [])
  );
  const [activeBar, setActiveBar] = useState<ActiveBar | null>(null);
  const [nextBar, setNextBar] = useState<number>(() => randomBarForLevel(1));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [bestLevel, setBestLevel] = useState(1);
  const [clears, setClears] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFastDropping, setIsFastDropping] = useState(false);
  const [message, setMessage] = useState("Press Start to play.");

  const levelRef = useRef(level);
  levelRef.current = level;
  const nextBarRef = useRef(nextBar);
  nextBarRef.current = nextBar;

  const config = useMemo(() => getLevelConfig(level), [level]);
  const { dropIntervalMs, fastDropIntervalMs, clearsToAdvance, maxColumnHeight } = config;

  useEffect(() => {
    const storedScore = Number(window.localStorage.getItem("gold-stack-best-score") || "0");
    const storedLevel = Number(window.localStorage.getItem("gold-stack-best-level") || "1");
    if (Number.isFinite(storedScore) && storedScore > 0) {
      setBestScore(storedScore);
    }
    if (Number.isFinite(storedLevel) && storedLevel > 1) {
      setBestLevel(storedLevel);
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      window.localStorage.setItem("gold-stack-best-score", String(score));
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (level > bestLevel) {
      setBestLevel(level);
      window.localStorage.setItem("gold-stack-best-level", String(level));
    }
  }, [level, bestLevel]);

  const totalBars = useMemo(
    () => stacks.reduce((sum, column) => sum + column.length, 0),
    [stacks]
  );

  const spawnBar = useCallback(
    (incomingValue: number, lane: number, board: StackState, currentLevel: number) => {
      const maxH = getLevelConfig(currentLevel).maxColumnHeight;
      if (!hasLegalMove(board, incomingValue, maxH)) {
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
    },
    []
  );

  const lockBar = useCallback(
    (bar: ActiveBar, board: StackState) => {
      const currentLevel = levelRef.current;
      const maxH = getLevelConfig(currentLevel).maxColumnHeight;
      const lane = bar.lane;
      const column = board[lane];
      const top = column[column.length - 1];
      let updatedColumn = column;

      if (top === bar.value) {
        updatedColumn = column.slice(0, -1);
        setScore((prev) => prev + bar.value * 2);
        setClears((prev) => prev + 1);
        setClearsInLevel((prev) => prev + 1);
        setMessage(`Perfect match! ${bar.value}g cleared.`);
      } else if (column.length < maxH) {
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
      const incoming = nextBarRef.current;
      setStacks(updatedStacks);
      setNextBar(randomBarForLevel(currentLevel));
      spawnBar(incoming, lane, updatedStacks, levelRef.current);
    },
    [spawnBar]
  );

  const stepDrop = useCallback(() => {
    if (!activeBar || gameOver) return;

    const maxH = getLevelConfig(levelRef.current).maxColumnHeight;
    const landingRow = getLandingRow(stacks, activeBar.lane, maxH);
    const nextRow = activeBar.row + 1;

    if (nextRow >= landingRow) {
      lockBar(activeBar, stacks);
      return;
    }

    setActiveBar({ ...activeBar, row: nextRow });
  }, [activeBar, gameOver, stacks, lockBar]);

  const moveHorizontal = useCallback(
    (delta: -1 | 1) => {
      if (!gameStarted || !activeBar || gameOver) return;

      const maxH = getLevelConfig(levelRef.current).maxColumnHeight;
      const newLane = Math.max(0, Math.min(COLUMN_COUNT - 1, activeBar.lane + delta));
      if (newLane === activeBar.lane) return;

      const movedBar = { ...activeBar, lane: newLane };
      const landingRow = getLandingRow(stacks, newLane, maxH);
      if (movedBar.row >= landingRow) {
        lockBar(movedBar, stacks);
        return;
      }

      setActiveBar(movedBar);
    },
    [gameStarted, activeBar, gameOver, stacks, lockBar]
  );

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const { clearsToAdvance: need } = getLevelConfig(level);
    if (clearsInLevel >= need) {
      setLevel((l) => {
        const next = l + 1;
        setMessage(`Level up! Level ${next} — faster drops & tougher bar mix.`);
        return next;
      });
      setClearsInLevel(0);
    }
  }, [clearsInLevel, level, gameStarted, gameOver]);

  const startOrRestartGame = () => {
    const freshBoard = Array.from({ length: COLUMN_COUNT }, () => []);
    const freshCurrent = randomBarForLevel(1);
    const freshUpcoming = randomBarForLevel(1);
    setStacks(freshBoard);
    setActiveBar({
      value: freshCurrent,
      lane: 1,
      row: -1,
    });
    setNextBar(freshUpcoming);
    setScore(0);
    setClears(0);
    setLevel(1);
    setClearsInLevel(0);
    levelRef.current = 1;
    setGameOver(false);
    setIsFastDropping(false);
    setGameStarted(true);
    setMessage("Level 1 — move left/right as the bar drops.");
  };

  useEffect(() => {
    if (!gameStarted || gameOver || !activeBar) return;
    const timer = window.setInterval(
      stepDrop,
      isFastDropping ? fastDropIntervalMs : dropIntervalMs
    );
    return () => window.clearInterval(timer);
  }, [
    gameStarted,
    activeBar,
    gameOver,
    isFastDropping,
    dropIntervalMs,
    fastDropIntervalMs,
    stacks,
    nextBar,
    stepDrop,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameStarted) return;
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
      if (!gameStarted) return;
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
  }, [gameStarted, moveHorizontal]);

  const boardHeightPx = maxColumnHeight * ROW_HEIGHT_PX + 8;

  return (
    <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Gold Bar Stack</h2>
          <p className="text-sm text-slate-600">
            Levels get faster (and trickier). Clear matches to level up.
          </p>
        </div>
        {gameStarted ? (
          <button
            type="button"
            onClick={startOrRestartGame}
            className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Restart
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Level</p>
          <p className="mt-2 text-lg font-bold text-amber-800">{gameStarted ? level : "—"}</p>
          <p className="text-xs text-slate-500">Best level: {bestLevel}</p>
        </div>
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

      {gameStarted && !gameOver ? (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50/80 p-3">
          <p className="text-xs font-medium text-amber-900">
            Next level: {clearsInLevel} / {clearsToAdvance} clears
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-200/80">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, (clearsInLevel / clearsToAdvance) * 100)}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Next Bar</p>
        <div
          className={`mt-2 rounded-lg border px-3 py-2 text-center text-sm font-bold ${
            gameStarted ? getBarClasses(nextBar) : "border-slate-200 bg-slate-100 text-slate-400"
          }`}
        >
          {gameStarted ? `${nextBar}g` : "—"}
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
          className="relative overflow-hidden rounded-xl border border-dashed border-amber-200 bg-white transition-[height] duration-300"
          style={{ height: `${boardHeightPx}px` }}
        >
          {!gameStarted ? (
            <div
              className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-white/90 px-4 backdrop-blur-[2px] ${MOBILE_CONTROL_PAD_CLASS}`}
              style={{ WebkitTouchCallout: "none", userSelect: "none" }}
            >
              <p className="text-center text-sm font-medium text-slate-600">
                Ready when you are — bars won&apos;t drop until you start.
              </p>
              <button
                type="button"
                draggable={false}
                onClick={startOrRestartGame}
                onContextMenu={(e) => e.preventDefault()}
                className={`${MOBILE_CONTROL_PAD_CLASS} rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-400 to-amber-600 px-10 py-3 text-base font-bold text-white shadow-lg transition hover:from-amber-500 hover:to-amber-700 active:scale-[0.98]`}
              >
                Start
              </button>
            </div>
          ) : null}
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

        <div
          className={`mt-3 grid grid-cols-3 gap-2 ${MOBILE_CONTROL_PAD_CLASS}`}
          style={{ WebkitTouchCallout: "none", userSelect: "none" }}
        >
          <button
            type="button"
            draggable={false}
            onClick={() => moveHorizontal(-1)}
            onContextMenu={(e) => e.preventDefault()}
            disabled={!gameStarted || gameOver || !activeBar}
            className={MOBILE_CONTROL_BTN_CLASS}
          >
            ← Left
          </button>
          <button
            type="button"
            draggable={false}
            onMouseDown={() => setIsFastDropping(true)}
            onMouseUp={() => setIsFastDropping(false)}
            onMouseLeave={() => setIsFastDropping(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsFastDropping(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsFastDropping(false);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              setIsFastDropping(false);
            }}
            onContextMenu={(e) => e.preventDefault()}
            disabled={!gameStarted || gameOver || !activeBar}
            className={MOBILE_CONTROL_BTN_CLASS}
          >
            ↓ Down
          </button>
          <button
            type="button"
            draggable={false}
            onClick={() => moveHorizontal(1)}
            onContextMenu={(e) => e.preventDefault()}
            disabled={!gameStarted || gameOver || !activeBar}
            className={MOBILE_CONTROL_BTN_CLASS}
          >
            Right →
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-charcoal">How to play</p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Tap Start — then the gold bar falls from the top automatically, step by step.</li>
          <li>Move it to any of 4 positions using arrow keys or buttons.</li>
          <li>Hold down arrow to speed up the fall.</li>
          <li>When it lands on the same weight, that top bar disappears and counts toward the next level.</li>
          <li>Each level speeds up drops; later levels pull heavier bars more often.</li>
          <li>No valid position for the incoming bar means game over.</li>
        </ul>
      </div>
    </section>
  );
}
