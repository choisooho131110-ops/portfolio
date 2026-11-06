"use client";

import { useCallback, useRef, useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

type ToastItem = { id: number; kind: "success" | "error"; text: string };

/** 작은 알림 목록을 관리하는 훅 */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((kind: ToastItem["kind"], text: string) => {
    const id = ++nextId.current;
    setToasts((list) => [...list.slice(-2), { id, kind, text }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), kind === "error" ? 5000 : 2500);
  }, []);

  return { toasts, show };
}

/** 화면 아래 가운데에 잠깐 떴다 사라지는 알림 */
export function Toaster({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      {toasts.map((t) => (
        <p
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className="flex max-w-full animate-[toast-in_.2s_ease-out] items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(27,36,64,0.25)]"
        >
          {t.kind === "success" ? (
            <CircleCheck className="size-5 shrink-0 text-mint" aria-hidden />
          ) : (
            <CircleAlert className="size-5 shrink-0 text-coral" aria-hidden />
          )}
          {t.text}
        </p>
      ))}
    </div>
  );
}
