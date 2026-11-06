// 편집 도구들이 같이 쓰는 모양

/** 클릭하면 고칠 수 있는 글자: 점선 테두리로 표시 */
export const EDITABLE =
  "cursor-text rounded-md outline-1 outline-offset-2 outline-dashed outline-primary/35 transition " +
  "hover:bg-primary/5 hover:outline-primary/70 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary";

export const INPUT =
  "w-full rounded-xl border border-primary bg-white px-3 py-2 text-base font-normal leading-relaxed text-ink " +
  "ring-4 ring-primary/15 outline-none placeholder:text-ink/35";

export const BTN_PRIMARY =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-[15px] font-bold text-white " +
  "transition hover:bg-[#1f5af0] disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none";

export const BTN_GHOST =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-4 text-[15px] font-semibold text-ink/70 " +
  "transition hover:bg-ink/5 disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none";

/** 한글 입력 중(조합 중) Enter 는 무시해야 글자가 잘리지 않아요 */
export function isComposing(e: React.KeyboardEvent) {
  return e.nativeEvent.isComposing || e.keyCode === 229;
}
