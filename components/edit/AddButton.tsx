"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

/** 섹션 제목 옆 [+ 추가] */
export function AddButton({ label, onAdd }: { label: string; onAdd: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      aria-label={`${label} 추가`}
      onClick={async () => {
        setBusy(true);
        try {
          await onAdd();
        } finally {
          setBusy(false);
        }
      }}
      className="inline-flex h-11 items-center gap-1 rounded-xl bg-primary px-4 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#1f5af0] disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" strokeWidth={2.5} aria-hidden />}
      추가
    </button>
  );
}
