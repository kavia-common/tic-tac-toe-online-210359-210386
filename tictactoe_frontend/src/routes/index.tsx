import { component$, useSignal, $, useTask$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Card } from "~/components/common/Card";
import { GameBoard } from "~/components/game/GameBoard";
import { GameControls } from "~/components/game/GameControls";
import { ScorePanel } from "~/components/game/ScorePanel";
import {
  applyMove,
  createInitialState,
  resetBoard,
  setMode,
  type GameState,
} from "~/lib/game/logic";
import { chooseCpuMove } from "~/lib/game/ai";
import theme from "~/styles/theme.css?inline";
import globals from "~/styles/globals.css?inline";

export default component$(() => {
  useStyles$(theme);
  useStyles$(globals);

  const state = useSignal<GameState>(createInitialState("pvp"));
  const errorMsg = useSignal<string | null>(null);

  const handleCellClick = $((idx: number) => {
    errorMsg.value = null;
    try {
      state.value = applyMove(state.value, idx);
    } catch (err) {
      // User-friendly error
      errorMsg.value = err instanceof Error ? err.message : "Invalid move.";
      return;
    }

    // CPU move if applicable
    if (state.value.mode === "cpu" && state.value.status === "playing" && state.value.currentPlayer === "O") {
      // CPU plays as "O"
      const move = chooseCpuMove(state.value.board, "O", "X");
      if (move >= 0) {
        try {
          state.value = applyMove(state.value, move);
        } catch (err) {
          errorMsg.value = err instanceof Error ? err.message : "CPU move failed.";
        }
      }
    }
  });

  const handleModeChange = $((mode: "pvp" | "cpu") => {
    state.value = setMode(state.value, mode);
    errorMsg.value = null;
  });

  const handleResetBoard = $(() => {
    state.value = resetBoard(state.value);
    errorMsg.value = null;
  });

  const handleNewGame = $(() => {
    // reuse resetBoard + zero scores via new game from logic if preferred
    state.value = { ...createInitialState(state.value.mode) };
    errorMsg.value = null;
  });

  // Accessibility: announce status updates
  const liveMsg = useSignal("");
  useTask$(({ track }) => {
    track(() => state.value.status);
    if (state.value.status === "won") {
      liveMsg.value = `Winner ${state.value.winner}`;
    } else if (state.value.status === "draw") {
      liveMsg.value = "Game ended in a draw.";
    } else {
      liveMsg.value = `Turn: ${state.value.currentPlayer}`;
    }
  });

  return (
    <div class="app-shell">
      <div class="container">
        <header class="header">
          <h1>Tic Tac Toe</h1>
          <p class="subtitle">Ocean Professional • Modern UI • PvP or CPU</p>
        </header>

        <div aria-live="polite" class="visually-hidden">
          {liveMsg.value}
        </div>

        <section class="grid-2">
          <Card>
            <div class="center" style={{ padding: "8px" }}>
              <GameBoard
                board={state.value.board}
                status={state.value.status}
                onCellClick$={handleCellClick}
              />
            </div>
          </Card>

          <Card>
            <div class="row" style={{ flexDirection: "column", gap: "16px" }}>
              <ScorePanel
                currentPlayer={state.value.currentPlayer}
                status={state.value.status}
                winner={state.value.winner}
                scores={state.value.scores}
              />

              <GameControls
                mode={state.value.mode}
                onModeChange$={handleModeChange}
                onResetBoard$={handleResetBoard}
                onNewGame$={handleNewGame}
              />

              {errorMsg.value && (
                <div
                  role="alert"
                  class="rounded-md border border-red-200 bg-red-50 p-3 text-[var(--color-error)]"
                >
                  {errorMsg.value}
                </div>
              )}
            </div>
          </Card>
        </section>

        <p class="footer-note">Accessible. Responsive. Qwik-powered.</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Tic Tac Toe • Ocean Professional",
  meta: [
    {
      name: "description",
      content:
        "Play Tic Tac Toe with a modern Ocean Professional theme. Choose PvP or vs CPU.",
    },
  ],
};
