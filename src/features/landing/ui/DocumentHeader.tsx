import { ARCHIVE_NAME, DEFAULT_DOCUMENT_ID } from "@/shared/config/app";

export function DocumentHeader() {
  return (
    <div className="flex items-start justify-between animate-in-0">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[12px] tracking-[0.3em] uppercase text-parchment-muted">
          {ARCHIVE_NAME}
        </span>
        <span className="font-mono text-[14px] tracking-[0.1em] text-parchment-dim">
          문서번호 : {DEFAULT_DOCUMENT_ID}
        </span>
      </div>

      <div
        className="animate-stamp shrink-0 border-2 border-blood/50 px-3 py-1.5 font-mono text-[13px] tracking-[0.3em] text-blood/50 select-none"
        aria-hidden="true"
      >
        기&nbsp;&nbsp;밀
      </div>
    </div>
  );
}
