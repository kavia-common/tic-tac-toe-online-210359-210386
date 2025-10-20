import { component$, $, type PropFunction } from "@builder.io/qwik";
import { Button } from "../common/Button";
import { Toggle } from "../common/Toggle";
import type { GameMode } from "~/lib/game/logic";

type Props = {
  mode: GameMode;
  onModeChange$: PropFunction<(mode: GameMode) => void>;
  onResetBoard$: PropFunction<() => void>;
  onNewGame$: PropFunction<() => void>;
};

// PUBLIC_INTERFACE
/**
 * Controls: PvP/CPU toggle, Reset board, New game.
 */
export const GameControls = component$<Props>(({ mode, onModeChange$, onResetBoard$, onNewGame$ }) => {
  const handleToggle = $((checked: boolean) => {
    onModeChange$(checked ? "cpu" : "pvp");
  });

  return (
    <div class="row" style={{ justifyContent: "space-between", width: "100%" }}>
      <Toggle
        checked={mode === "cpu"}
        labelLeft="PvP"
        labelRight="CPU"
        onToggleChange$={$((ev: Event) => {
          const detail = (ev as CustomEvent<{ checked: boolean }>).detail;
          handleToggle(detail?.checked ?? false);
        })}
      />
      <div class="row">
        <Button variant="ghost" onClick$={onResetBoard$}>
          Reset Board
        </Button>
        <Button variant="secondary" onClick$={onNewGame$}>
          New Game
        </Button>
      </div>
    </div>
  );
});
