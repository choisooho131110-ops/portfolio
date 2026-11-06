"use client";

import { useState } from "react";
import { CalendarDays, Check, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { BTN_GHOST, BTN_PRIMARY, EDITABLE, INPUT } from "./styles";

type Props = {
  value: string | null;
  placeholder: string;
  label: string;
  /** 앞에 붙는 말 (예: "취득") */
  prefix?: string;
  onSave: (value: string | null) => Promise<boolean>;
};

/** 클릭하면 날짜 고르기로 바뀌는 날짜 */
export function InlineDate({ value, placeholder, label, prefix, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(next: string | null) {
    if (next === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onSave(next);
    setSaving(false);
    if (ok) setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value ?? "");
          setEditing(true);
        }}
        className={`${EDITABLE} inline-flex min-h-11 items-center gap-1 text-sm text-ink/65`}
      >
        <CalendarDays className="size-4" aria-hidden />
        {value ? (
          <span>
            {prefix && `${prefix} `}
            {formatDate(value)}
          </span>
        ) : (
          <span className="opacity-80">{placeholder}</span>
        )}
        <span className="sr-only"> — {label} 고치기</span>
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <input
        type="date"
        autoFocus
        value={draft}
        max="2100-12-31"
        aria-label={label}
        readOnly={saving}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
          if (e.key === "Enter") save(draft || null);
        }}
        className={`${INPUT} h-11`}
      />
      <div className="flex flex-wrap items-center justify-end gap-2">
        {value && (
          <button type="button" onClick={() => save(null)} disabled={saving} className={`${BTN_GHOST} mr-auto text-coral`}>
            날짜 지우기
          </button>
        )}
        <button type="button" onClick={() => setEditing(false)} disabled={saving} className={BTN_GHOST}>
          취소
        </button>
        <button type="button" onClick={() => save(draft || null)} disabled={saving} className={BTN_PRIMARY}>
          {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
          저장
        </button>
      </div>
    </div>
  );
}
