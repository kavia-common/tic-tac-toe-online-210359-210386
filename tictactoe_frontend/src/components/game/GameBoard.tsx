import { component$, $, type PropFunction } from "@builder.io/qwik";
import type { Board, GameStatus } from "~/lib/game/logic";

type GameBoardProps = {
  board: Board;
  status: GameStatus;
  onCellClick$: PropFunction<(index: number) => void>;
};

// PUBLIC_INTERFACE
/**
 * Accessible 3x3 Tic Tac Toe board component.
 */
export const GameBoard = component$<GameBoardProps>(({ board, status, onCellClick$ }) => {
  const handleClick = $((idx: number) => {
    if (status !== "playing") return;
    onCellClick$(idx);
  });

  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      class="grid grid-cols-3 gap-3"
      style={{ maxWidth: "360px" }}
    >
      {board.map((cell, idx) => {
        const label = `Cell ${idx + 1}`;
        return (
          <button
            key={idx}
            type="button"
            role="gridcell"
            aria-label={label}
            aria-disabled={status !== "playing" || cell !== null}
            class={[
              "h-24 w-24 rounded-lg shadow-md transition",
              "bg-white hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
              "text-3xl font-semibold text-[var(--color-primary)]",
              cell ? "cursor-default" : "cursor-pointer",
            ].join(" ")}
            onClick$={() => handleClick(idx)}
          >
            {cell ?? ""}
          </button>
        );
      })}
    </div>
  );
});
