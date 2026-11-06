import { TriangleAlert } from "lucide-react";

/** DB를 못 읽었을 때 보여주는 안내 (개발 중에는 원인도 같이 보여줌) */
export function LoadError({ detail }: { detail?: string }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-6 text-center">
        <TriangleAlert className="mx-auto size-10 text-coral" aria-hidden />
        <h1 className="mt-3 text-xl font-bold">내용을 불러오지 못했어요</h1>
        <p className="mt-2 text-ink/70">잠시 후 새로고침해 주세요.</p>
        {detail && process.env.NODE_ENV === "development" && (
          <p className="mt-4 rounded-xl bg-coral/10 p-3 text-left text-sm break-all text-[#b3262b]">
            {detail}
          </p>
        )}
      </div>
    </main>
  );
}
