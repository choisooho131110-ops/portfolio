import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "로그인",
  robots: { index: false, follow: false }, // 검색엔진에 나오지 않게
};

// 회원가입 버튼 없음: 주인 계정 하나만 Supabase에서 직접 만들어요
export default function LoginPage() {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-16 size-64 rounded-full bg-sunny/35 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 size-64 rotate-12 rounded-[3rem] bg-primary/15 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-line bg-card p-6 shadow-[0_8px_32px_rgba(27,36,64,0.06)] md:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden>
              <Gamepad2 className="size-8" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">주인 로그인</h1>
            <p className="mt-1 text-[15px] text-ink/65">포트폴리오를 고치려면 로그인해요</p>
          </div>
          <LoginForm />
        </div>

        <Link
          href="/"
          className="mx-auto mt-4 flex min-h-11 w-fit items-center gap-1.5 rounded-lg px-3 text-[15px] font-medium text-ink/65 hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          포트폴리오로 돌아가기
        </Link>
      </div>
    </main>
  );
}
