import { Slot, component$ } from "@builder.io/qwik";

// PUBLIC_INTERFACE
/**
 * Container card with theme styling and subtle shadow.
 */
export const Card = component$(() => {
  return (
    <div class="card transition">
      <Slot />
    </div>
  );
});
