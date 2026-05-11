import { useId, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { cn } from "@/shared/lib/cn";
import sound from "@/shared/lib/sound";

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function RetroInput({
  label,
  error,
  id,
  className = "",
  onKeyDown,
  ...props
}: RetroInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1 || e.key === "Backspace") sound.tick();
    onKeyDown?.(e);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-parchment-dim"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex items-center border border-wire bg-wire/10",
          "transition-all duration-200",
          "focus-within:border-blood",
          "focus-within:shadow-[0_0_0_1px_#8b1a1a,_inset_0_0_12px_rgba(139,26,26,0.08)]",
          className,
        )}
      >
        <span className="pl-3 pr-1 font-mono text-sm text-blood/80 select-none shrink-0 leading-none">
          ›
        </span>
        <input
          id={inputId}
          type={props.type ?? "text"}
          className="flex-1 py-[10px] pr-3 bg-transparent border-none text-parchment font-mono text-sm tracking-[0.04em] placeholder:text-parchment-muted placeholder:italic outline-none caret-blood-bright min-w-0"
          onKeyDown={handleKeyDown}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
      </div>

      {error && (
        <span className="font-mono text-[11px] text-blood-bright" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
