import { component$ } from "@builder.io/qwik";
import type { GameStatus, Scores } from "~/lib/game/logic";

type Props = {
  currentPlayer: "X" | "O";
  status: GameStatus;
  winner: "X" | "O" | null;
  scores: Scores;
};

// PUBLIC_INTERFACE
/**
 * Displays scores, turn info, and status messages.
 */
export const ScorePanel = component$<Props>(({ currentPlayer, status, winner, scores }) => {
  return (
    <div class="row" style={{ justifyContent: "space-between" }}>
      <div>
        <div class="text-sm text-[var(--color-muted)]">Current Player</div>
        <div class="text-lg font-semibold text-[var(--color-primary)]">{currentPlayer}</div>
      </div>
      <div>
        <div class="text-sm text-[var(--color-muted)]">Scores</div>
        <div class="text-lg font-semibold">
          X: {scores.X} &nbsp;|&nbsp; O: {scores.O}
        </div>
      </div>
      <div>
        <div class="text-sm text-[var(--color-muted)]">Status</div>
        <div class="text-lg font-semibold">
          {status === "playing" && "Playing"}
          {status === "won" && (
            <span class="text-[var(--color-secondary)]">Winner: {winner}</span>
          )}
          {status === "draw" && <span class="text-[var(--color-muted)]">Draw</span>}
        </div>
      </div>
    </div>
  );
});
