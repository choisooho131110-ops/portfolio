import Link from "next/link";
import { Eye, LogOut, Pencil } from "lucide-react";
import { signOut } from "@/app/edit/actions";

/** 편집 화면 맨 위에 고정되는 띠: ✏️ 편집 모드 · 보기 화면으로 · 로그아웃 */
export function EditBar() {
  const button =
    "flex h-11 items-center gap-1.5 rounded-lg px-3 text-[15px] font-semibold transition " +
    "hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none";

  return (
    <div className="sticky top-0 z-40 h-(--edit-bar) bg-ink text-white">
      <div className="mx-auto flex h-full max-w-5xl items-center gap-1 px-4">
        <p className="mr-auto flex items-center gap-2 font-bold">
          <span className="flex size-7 items-center justify-center rounded-full bg-sunny text-ink" aria-hidden>
            <Pencil className="size-4" strokeWidth={2.5} />
          </span>
          편집 모드
        </p>
        <Link href="/" className={button}>
          <Eye className="size-5" aria-hidden />
          <span>
            보기<span className="hidden sm:inline"> 화면으로</span>
          </span>
        </Link>
        <form action={signOut}>
          <button type="submit" className={button}>
            <LogOut className="size-5" aria-hidden />
            로그아웃
          </button>
        </form>
      </div>
    </div>
  );
}
