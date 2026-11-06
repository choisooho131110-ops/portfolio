"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { BTN_PRIMARY, INPUT, isComposing } from "./styles";

const EMOJIS = ["🎮", "🕹️", "👾", "🏆", "📚", "✏️", "💻", "🤖", "⚽", "🏀", "⚾", "🏓", "🎨", "🎵", "🎸", "🎬", "📷", "🧩", "🔬", "🚀", "🐶", "🐱", "🍕", "✈️"];

type Props = {
  value: string;
  label: string;
  onSave: (emoji: string) => Promise<boolean>;
};

/** 관심사 이모지: 누르면 고르기 창이 열려요 */
export function EmojiPicker({ value, label, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 바깥을 누르거나 Esc 를 누르면 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function pick(emoji: string) {
    const next = emoji.trim();
    if (!next || next === value) {
      setOpen(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(next);
    setSaving(false);
    if (ok) {
      setOpen(false);
      setCustom("");
    }
  }

  return (
    <div ref={boxRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${label}: ${value} — 바꾸기`}
        className="relative flex size-14 items-center justify-center rounded-2xl bg-sunny/25 text-3xl outline-1 outline-offset-2
          outline-dashed outline-primary/35 transition hover:outline-primary/70 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span aria-hidden>{value}</span>
        <span className="absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow" aria-hidden>
          <Pencil className="size-3.5" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="이모지 고르기"
          className="absolute top-full left-0 z-20 mt-2 w-[min(18rem,calc(100vw-4rem))] rounded-2xl border border-line bg-card p-3 shadow-[0_12px_32px_rgba(27,36,64,0.16)]"
        >
          <div className="grid grid-cols-6 gap-1">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                disabled={saving}
                onClick={() => pick(e)}
                aria-label={e}
                className={`flex aspect-square items-center justify-center rounded-lg text-2xl transition hover:bg-sunny/30 ${
                  e === value ? "bg-sunny/40" : ""
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-line pt-3">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (isComposing(e)) return;
                if (e.key === "Enter") pick(custom);
              }}
              maxLength={8}
              placeholder="직접 입력"
              aria-label="이모지 직접 입력"
              className={`${INPUT} h-11 min-w-0 flex-1 ring-0`}
            />
            <button type="button" disabled={saving || !custom.trim()} onClick={() => pick(custom)} className={BTN_PRIMARY}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
