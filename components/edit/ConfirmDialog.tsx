"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { BTN_GHOST } from "./styles";

type ConfirmOptions = { title: string; message?: string; confirmLabel?: string };
type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

/** const ok = await confirm({ title: "정말 삭제할까요?" }) 처럼 쓰는 확인창 */
export function useConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  );

  const close = useCallback(
    (ok: boolean) => {
      pending?.resolve(ok);
      setPending(null);
    },
    [pending],
  );

  return { confirm, dialog: <ConfirmDialog pending={pending} onClose={close} /> };
}

function ConfirmDialog({ pending, onClose }: { pending: Pending | null; onClose: (ok: boolean) => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (pending && !dialog.open) dialog.showModal();
    if (!pending && dialog.open) dialog.close();
  }, [pending]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault(); // Esc
        onClose(false);
      }}
      onClick={(e) => e.target === ref.current && onClose(false)} // 바깥(어두운 부분) 클릭
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-card p-0 text-ink shadow-[0_24px_64px_rgba(27,36,64,0.3)] backdrop:bg-ink/45"
    >
      {pending && (
        <div className="p-6">
          <span className="flex size-12 items-center justify-center rounded-full bg-coral/10 text-coral" aria-hidden>
            <TriangleAlert className="size-6" />
          </span>
          <h2 id="confirm-title" className="mt-4 text-lg font-bold">
            {pending.title}
          </h2>
          {pending.message && <p className="mt-1 leading-relaxed text-ink/70">{pending.message}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" autoFocus onClick={() => onClose(false)} className={BTN_GHOST}>
              취소
            </button>
            <button
              type="button"
              onClick={() => onClose(true)}
              className="inline-flex h-11 items-center rounded-xl bg-coral px-5 text-[15px] font-bold text-white transition hover:bg-[#ec474c]"
            >
              {pending.confirmLabel ?? "삭제"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
