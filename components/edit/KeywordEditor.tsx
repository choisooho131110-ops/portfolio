"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { PROFILE_GUIDE } from "@/lib/placeholders";
import { BTN_GHOST, BTN_PRIMARY, INPUT, isComposing } from "./styles";

const MAX_KEYWORDS = 10;
const MAX_LENGTH = 20;

type Props = {
  keywords: string[];
  chipColors: string[];
  onSave: (keywords: string[]) => Promise<boolean>;
  /** 칩 이름 (키워드 / 태그) */
  label?: string;
  /** 칩 앞에 붙는 글자 */
  prefix?: string;
  placeholder?: string;
  /** 입력창 아래 안내 문구 */
  hint?: string;
  align?: "center" | "left";
  size?: "md" | "sm";
};

/** 키워드·태그 칩: × 로 지우고, + 버튼으로 추가 */
export function KeywordEditor({
  keywords,
  chipColors,
  onSave,
  label = "키워드",
  prefix = "#",
  placeholder = PROFILE_GUIDE.keyword,
  hint,
  align = "center",
  size = "md",
}: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(next: string[]) {
    setBusy(true);
    const ok = await onSave(next);
    setBusy(false);
    return ok;
  }

  async function add() {
    const word = draft.replace(/^#+/, "").trim();
    if (!word) return;
    if (keywords.includes(word)) {
      setError(`이미 있는 ${label}예요.`);
      return;
    }
    if (await save([...keywords, word])) {
      setDraft("");
      setError(null);
      setAdding(false);
    }
  }

  const center = align === "center";
  const chipText = size === "sm" ? "text-sm" : "text-base";
  const chipPad = size === "sm" ? "py-1 pl-3" : "py-2 pl-4";

  return (
    <div className={`flex flex-col gap-2 ${center ? "mt-6 items-center" : "items-stretch"}`}>
      <ul className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`} aria-label={label}>
        {keywords.map((k, i) => (
          <li
            key={k}
            className={`flex items-center rounded-full font-semibold ${chipPad} ${chipText} ${chipColors[i % chipColors.length]}`}
          >
            {prefix}
            {k}
            <button
              type="button"
              disabled={busy}
              onClick={() => save(keywords.filter((x) => x !== k))}
              aria-label={`${k} ${label} 지우기`}
              className="-my-2 ml-0.5 flex size-11 items-center justify-center rounded-full opacity-60 transition hover:bg-black/5 hover:opacity-100"
            >
              <X className="size-4" aria-hidden />
            </button>
          </li>
        ))}

        {!adding && keywords.length < MAX_KEYWORDS && (
          <li>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className={`flex h-11 items-center gap-1 rounded-full border-2 border-dashed border-primary/40 px-4 font-semibold text-primary transition hover:border-primary hover:bg-primary/5 ${chipText}`}
            >
              <Plus className="size-4" aria-hidden />
              {label}
            </button>
          </li>
        )}
      </ul>

      {adding && (
        <div className={`flex w-full flex-col gap-2 ${center ? "max-w-sm" : ""}`}>
          <div className="flex gap-2">
            <input
              autoFocus
              value={draft}
              maxLength={MAX_LENGTH}
              placeholder={placeholder}
              aria-label={`새 ${label}`}
              readOnly={busy}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (isComposing(e)) return;
                if (e.key === "Enter") add();
                if (e.key === "Escape") setAdding(false);
              }}
              className={`${INPUT} h-11 min-w-0 flex-1`}
            />
            <button type="button" onClick={() => setAdding(false)} disabled={busy} className={`${BTN_GHOST} px-3`}>
              취소
            </button>
            <button type="button" onClick={add} disabled={busy || !draft.trim()} className={`${BTN_PRIMARY} px-3`}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "추가"}
            </button>
          </div>
          {hint && !error && <p className="text-sm text-ink/65">{hint}</p>}
          {error && <p className="text-sm text-[#c7343a]">{error}</p>}
        </div>
      )}
    </div>
  );
}
