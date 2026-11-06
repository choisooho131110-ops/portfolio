"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { BTN_GHOST, BTN_PRIMARY, EDITABLE, INPUT, isComposing } from "./styles";

type Props = {
  value: string;
  /** 안내 문구 (빈 칸일 때 보이고, 입력창 placeholder 로도 사용) */
  placeholder: string;
  /** 화면 읽기 프로그램용 칸 이름 (예: "대회 이름") */
  label: string;
  onSave: (value: string) => Promise<boolean>;
  /** true: 여러 줄 (Enter = 줄바꿈, Ctrl+Enter = 저장) */
  multiline?: boolean;
  maxLength?: number;
  /** 평소 글자 모양 */
  className?: string;
  /** 입력창 글자 모양 */
  inputClassName?: string;
};

/** 클릭하면 입력창으로 바뀌는 글자 */
export function InlineText({
  value,
  placeholder,
  label,
  onSave,
  multiline = false,
  maxLength = multiline ? 1000 : 120,
  className = "",
  inputClassName = "",
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  // 아직 안내 문구 그대로인 칸 (처음 예시 카드, 새로 만든 카드)
  const isGuide = value === placeholder;

  useEffect(() => {
    if (!editing || !ref.current) return;
    const el = ref.current;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    autoGrow(el);
  }, [editing]);

  function open() {
    // 안내 문구는 지우고 빈 칸에서 시작 (안내는 placeholder 로 보여요)
    setDraft(isGuide ? "" : value);
    setEditing(true);
  }

  async function save() {
    const next = multiline ? draft.trim() : draft.replace(/\s*\n\s*/g, " ").trim();
    if (next === value || (isGuide && next === "")) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(next);
    setSaving(false);
    if (ok) setEditing(false);
    else ref.current?.focus(); // 실패하면 입력창에 그대로 머물러서 다시 시도하거나 Esc 로 취소
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={open}
        className={`${EDITABLE} inline-flex min-h-11 max-w-full items-center text-left ${className}`}
      >
        {value && !isGuide ? value : <span className="opacity-55">{value || placeholder}</span>}
        <span className="sr-only"> — {label} 고치기</span>
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <textarea
        ref={ref}
        value={draft}
        rows={1}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={label}
        readOnly={saving}
        aria-busy={saving}
        onChange={(e) => {
          setDraft(e.target.value);
          autoGrow(e.target);
        }}
        onKeyDown={(e) => {
          if (isComposing(e)) return;
          if (e.key === "Escape") {
            e.preventDefault();
            setEditing(false);
          } else if (e.key === "Enter" && (!multiline || e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            save();
          }
        }}
        className={`${INPUT} resize-none overflow-hidden ${multiline ? "min-h-24" : ""} ${inputClassName}`}
      />
      <div className="flex items-center justify-end gap-2">
        <span className="mr-auto hidden text-xs text-ink/40 md:inline">
          {multiline ? "Ctrl+Enter 저장 · Esc 취소" : "Enter 저장 · Esc 취소"}
        </span>
        <button type="button" onClick={() => setEditing(false)} disabled={saving} className={BTN_GHOST}>
          취소
        </button>
        <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
          저장
        </button>
      </div>
    </div>
  );
}

/** 글자 양에 맞춰 입력창 높이 늘리기 */
function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + 2}px`;
}
