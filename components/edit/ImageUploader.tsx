"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

type Props = {
  src: string | null;
  alt: string;
  /** 사진이 없을 때 보이는 안내 문구 */
  guide: string;
  onUpload: (file: File) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
  /** card: 카드 맨 위 사진 / avatar: 프로필 사진 아래 버튼만 */
  variant?: "card" | "avatar";
};

/** 사진 올리기 · 바꾸기 · 지우기 */
export function ImageUploader({ src, alt, guide, onUpload, onRemove, variant = "card" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function run(task: () => Promise<boolean>) {
    setBusy(true);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  }

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // 같은 사진을 다시 골라도 동작하게
        if (file) run(() => onUpload(file));
      }}
    />
  );
  const pick = () => inputRef.current?.click();

  const pill =
    "inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold shadow-sm transition disabled:opacity-60";

  if (variant === "avatar") {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {fileInput}
        {busy ? (
          <span className={`${pill} bg-card text-ink/65 ring-1 ring-line`} role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            사진 올리는 중…
          </span>
        ) : src ? (
          <>
            <button type="button" onClick={pick} className={`${pill} bg-card text-ink ring-1 ring-line hover:ring-primary`}>
              <RefreshCw className="size-4" aria-hidden />
              사진 바꾸기
            </button>
            <button type="button" onClick={() => run(onRemove)} className={`${pill} bg-card text-coral ring-1 ring-line hover:ring-coral`}>
              <Trash2 className="size-4" aria-hidden />
              지우기
            </button>
          </>
        ) : (
          <button type="button" onClick={pick} className={`${pill} bg-primary text-white hover:bg-[#1f5af0]`}>
            <Camera className="size-4" aria-hidden />
            사진 올리기
          </button>
        )}
      </div>
    );
  }

  // 카드: 사진이 없으면 작은 점선 칸
  if (!src) {
    return (
      <div className="px-5 pt-5">
        {fileInput}
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-3 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-70"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden>
            {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-primary">{busy ? "사진 올리는 중…" : "사진 올리기"}</span>
            <span className="block text-sm text-ink/65">{guide}</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full bg-line/50">
      {fileInput}
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
      {busy && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60" role="status">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          <span className="sr-only">사진 처리 중</span>
        </div>
      )}
      <div className="absolute right-3 bottom-3 flex gap-2">
        <button type="button" onClick={pick} disabled={busy} className={`${pill} bg-white/95 text-ink hover:bg-white`}>
          <RefreshCw className="size-4" aria-hidden />
          사진 바꾸기
        </button>
        <button
          type="button"
          onClick={() => run(onRemove)}
          disabled={busy}
          aria-label="사진 지우기"
          className={`${pill} bg-white/95 px-3 text-coral hover:bg-white`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
