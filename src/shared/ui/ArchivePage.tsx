import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { CRTScreen } from "@/shared/ui/CRTScreen";

interface ArchivePageProps {
  children: ReactNode;
  contentClassName?: string;
  mainClassName?: string;
  panelClassName?: string;
}

export function ArchivePage({
  children,
  contentClassName,
  mainClassName,
  panelClassName,
}: ArchivePageProps) {
  return (
    <CRTScreen>
      <main
        className={cn(
          "relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:py-12 page-enter",
          mainClassName,
        )}
      >
        <section
          className={cn(
            "relative w-full border border-wire bg-paper shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]",
            panelClassName,
          )}
        >
          <div className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-blood/60" />
          <div className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-blood/60" />
          <div
            className={cn("px-[clamp(24px,8vw,48px)] py-[clamp(32px,8vw,56px)]", contentClassName)}
          >
            {children}
          </div>
        </section>
      </main>
    </CRTScreen>
  );
}
