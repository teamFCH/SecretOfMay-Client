import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import sound from "@/shared/lib/sound";

export function MuteButton() {
  const [muted, setMuted] = useState(sound.isMuted);

  const toggle = () => {
    const next = sound.toggleMute();
    setMuted(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "select-none font-mono text-[9px] tracking-[0.15em] text-parchment-muted/60 transition-colors duration-150",
        "hover:text-parchment-muted focus-visible:outline-none focus-visible:text-parchment focus-visible:ring-1 focus-visible:ring-blood-bright/60",
      )}
      aria-label={muted ? "소리 켜기" : "소리 끄기"}
      aria-pressed={muted}
    >
      {muted ? "[무음]" : "[소리]"}
    </button>
  );
}
