import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import sound from "@/shared/lib/sound";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export function RetroButton({
  children,
  fullWidth = false,
  variant = "primary",
  className = "",
  onMouseEnter,
  onClick,
  ...props
}: RetroButtonProps) {
  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    sound.hover();
    onMouseEnter?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    sound.click();
    onClick?.(e);
  };

  const variantClassName =
    variant === "secondary"
      ? [
          "border border-wire/50 bg-transparent text-parchment-muted",
          "hover:border-wire hover:text-parchment hover:bg-wire/20",
          "disabled:hover:bg-transparent disabled:hover:border-wire/50",
        ].join(" ")
      : variant === "ghost"
        ? [
            "border border-transparent bg-transparent text-parchment-muted/70",
            "hover:text-parchment-muted hover:bg-wire/10",
            "disabled:hover:bg-transparent",
          ].join(" ")
        : [
            "border border-blood-bright/50 bg-blood text-parchment",
            "hover:border-blood-bright hover:bg-blood-bright",
            "hover:shadow-[0_0_12px_rgba(139,26,26,0.3),_0_0_24px_rgba(139,26,26,0.15)]",
            "disabled:hover:bg-blood disabled:hover:shadow-none",
          ].join(" ");

  return (
    <button
      aria-label={typeof children === "string" ? children : undefined}
      {...props}
      type={props.type ?? "button"}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center",
        "px-8 py-2.5",
        "font-mono text-[11px] tracking-[0.22em] uppercase",
        "transition-all duration-150 ease-in-out cursor-pointer",
        "active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood-bright/70",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantClassName,
        fullWidth ? "w-full" : "",
        className,
      )}
    >
      {children}
    </button>
  );
}
