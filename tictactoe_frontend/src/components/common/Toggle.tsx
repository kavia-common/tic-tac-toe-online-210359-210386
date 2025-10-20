import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";

type ToggleProps = {
  checked?: boolean;
  labelLeft?: string;
  labelRight?: string;
  /**
   * Optional handler; consider listening to `onToggleChange$` CustomEvent instead to avoid lexical captures.
   */
  onChange$?: (checked: boolean) => void;
};

// PUBLIC_INTERFACE
/**
 * Accessible switch toggle component.
 * Emits a CustomEvent "toggleChange" with detail {checked:boolean}.
 */
export const Toggle = component$<ToggleProps>(
  ({ checked = false, labelLeft = "Off", labelRight = "On", onChange$ }) => {
    const value = useSignal<boolean>(checked);
    const hostRef = useSignal<HTMLElement>();

    // keep value synced to prop
    useTask$(({ track }) => {
      track(() => checked);
      value.value = checked;
    });

    // Click handler: update, dispatch event, and best-effort invoke onChange$ if provided.
    const onClickHandler$ = $(() => {
      const next = !value.value;
      value.value = next;

      // Dispatch custom event for parent listeners (recommended)
      const el = hostRef.value;
      if (el) {
        el.dispatchEvent(
          new CustomEvent("toggleChange", {
            detail: { checked: next },
            bubbles: true,
            composed: true,
          }),
        );
      }

      // Optional direct call (may be ignored by linter in some configs; kept for compatibility)
      if (typeof onChange$ === "function") {
        try {
          onChange$(next);
        } catch {
          // no-op
        }
      }
    });

    return (
      <div ref={hostRef} class="row" role="group" aria-label="Mode">
        <span aria-hidden="true">{labelLeft}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value.value}
          class={[
            "transition relative inline-flex h-6 w-12 items-center rounded-full",
            value.value ? "bg-[var(--color-primary)]" : "bg-gray-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
          ].join(" ")}
          onClick$={onClickHandler$}
        >
          <span
            class={[
              "transition inline-block h-5 w-5 transform rounded-full bg-white shadow",
              value.value ? "translate-x-6" : "translate-x-1",
            ].join(" ")}
          />
        </button>
        <span aria-hidden="true">{labelRight}</span>
      </div>
    );
  },
)
