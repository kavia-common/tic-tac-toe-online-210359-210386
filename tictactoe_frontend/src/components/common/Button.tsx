import { Slot, component$, type QwikIntrinsicElements } from "@builder.io/qwik";

type ButtonProps = QwikIntrinsicElements["button"] & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

// PUBLIC_INTERFACE
/**
 * A reusable, accessible button styled with the Ocean Professional theme.
 */
export const Button = component$<ButtonProps>(({ variant = "primary", size = "md", disabled, ...props }) => {
  const base =
    "transition inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  } as const;
  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-700)] shadow-sm focus-visible:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-secondary)] text-black hover:brightness-95 shadow-sm focus-visible:ring-[var(--color-secondary)]",
    ghost:
      "bg-transparent text-[var(--color-primary)] hover:bg-blue-50 focus-visible:ring-[var(--color-primary)]",
  } as const;

  return (
    <button
      {...props}
      disabled={disabled}
      class={[
        base,
        sizes[size],
        variants[variant],
        disabled ? "opacity-60 cursor-not-allowed" : "",
        props.class,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Slot />
    </button>
  );
});
