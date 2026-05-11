import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface CRTScreenProps {
  children: ReactNode;
  className?: string;
}

export function CRTScreen({ children, className }: CRTScreenProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-paper",
        className,
      )}
    >
      <div className="crt-noise" aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      {children}
    </div>
  );
}
