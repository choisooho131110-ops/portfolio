import type { ReactNode } from "react";
import { getSection } from "@/lib/sections";
import type { SectionTable } from "@/lib/types";

type Props = {
  section: SectionTable;
  count?: number;
  /** 제목 오른쪽에 붙는 버튼 자리 (편집 모드의 + 추가 등) */
  action?: ReactNode;
};

export function SectionHeader({ section, count, action }: Props) {
  const { title, icon: Icon, accent } = getSection(section);
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}
        aria-hidden
      >
        <Icon className="size-6" strokeWidth={2.2} />
      </span>
      <h2 id={`${section}-title`} className="text-2xl font-extrabold tracking-tight">
        {title}
      </h2>
      {count !== undefined && (
        <span className="rounded-full bg-card px-2.5 py-0.5 text-sm font-semibold text-ink/65 ring-1 ring-line">
          {count}
        </span>
      )}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
