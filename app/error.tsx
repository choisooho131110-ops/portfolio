"use client"; // 오류 화면은 클라이언트 컴포넌트여야 해요

import Link from "next/link";
import { RotateCw, TriangleAlert } from "lucide-react";

/** 화면을 그리다가 예상치 못한 오류가 났을 때 */
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-6 text-center">
        <TriangleAlert className="mx-auto size-10 text-coral" aria-hidden />
        <h1 className="mt-3 text-xl font-bold">앗, 문제가 생겼어요</h1>
        <p className="mt-2 text-ink/70">잠시 후 다시 시도해 주세요. 계속 안 되면 인터넷 연결을 확인해 주세요.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-[#1f5af0]"
          >
            <RotateCw className="size-4" aria-hidden />
            다시 시도
          </button>
          <Link href="/" className="inline-flex h-11 items-center rounded-xl px-5 font-semibold text-ink/70 hover:bg-ink/5">
            첫 화면으로
          </Link>
        </div>
      </div>
    </main>
  );
}
