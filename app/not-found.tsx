import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export const metadata: Metadata = { title: "페이지를 찾을 수 없어요" };

/** 없는 주소로 들어왔을 때 (404) */
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden>
          <Gamepad2 className="size-9" />
        </span>
        <p className="mt-5 text-sm font-bold tracking-widest text-primary">404</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">이 맵은 아직 열리지 않았어요</h1>
        <p className="mt-2 text-ink/70">주소가 맞는지 한 번 더 확인해 주세요.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-[#1f5af0]"
        >
          첫 화면으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
