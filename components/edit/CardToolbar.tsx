"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";

type Props = {
  isSample: boolean;
  onDelete: () => Promise<void>;
  onMoveUp?: () => Promise<void>;
  onMoveDown?: () => Promise<void>;
  /** 순서 버튼을 보여줄지 (관심사만) */
  movable?: boolean;
};

/** 편집 화면에서 카드 맨 위에 붙는 줄: [예시] ··· [↑][↓][🗑 삭제] */
export function CardToolbar({ isSample, onDelete, onMoveUp, onMoveDown, movable }: Props) {
  const [busy, setBusy] = useState(false);

  async function run(task?: () => Promise<void>) {
    if (!task) return;
    setBusy(true);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  }

  const icon =
    "flex size-11 items-center justify-center rounded-lg text-ink/65 transition hover:bg-ink/5 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-1 border-b border-line bg-bg/70 py-0.5 pr-1 pl-4">
      {isSample ? (
        <span
          className="rounded-full bg-sunny/40 px-2.5 py-0.5 text-xs font-bold text-ink/80"
          title="아직 안내 문구 그대로예요. 한 번 저장하면 사라져요."
        >
          예시
        </span>
      ) : (
        <span className="text-xs font-medium text-ink/35">카드</span>
      )}
      {busy && <Loader2 className="ml-2 size-4 animate-spin text-ink/40" aria-label="처리 중" />}

      <div className="ml-auto flex items-center">
        {movable && (
          <>
            <button type="button" className={icon} disabled={busy || !onMoveUp} onClick={() => run(onMoveUp)} aria-label="위로 옮기기">
              <ArrowUp className="size-5" aria-hidden />
            </button>
            <button type="button" className={icon} disabled={busy || !onMoveDown} onClick={() => run(onMoveDown)} aria-label="아래로 옮기기">
              <ArrowDown className="size-5" aria-hidden />
            </button>
          </>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => run(onDelete)}
          className="flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-coral transition hover:bg-coral/10 disabled:opacity-40"
        >
          <Trash2 className="size-4" aria-hidden />
          삭제
        </button>
      </div>
    </div>
  );
}
