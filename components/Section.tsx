import type { ReactNode } from "react";
import type { SectionTable } from "@/lib/types";
import { SectionHeader } from "./SectionHeader";

type Props = {
  section: SectionTable;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
};

/** 섹션 하나: 제목 + 카드 목록 (휴대폰 1열 → 태블릿 2열 → PC 3열) */
export function Section({ section, count, action, children }: Props) {
  return (
    <section
      id={section}
      aria-labelledby={`${section}-title`}
      className="scroll-mt-[calc(5rem+var(--edit-bar,0px))] py-8 md:py-11"
    >
      <SectionHeader section={section} count={count} action={action} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

/** 편집 화면에서 카드가 하나도 없을 때 */
export function EmptySection() {
  return (
    <p className="col-span-full rounded-2xl border-2 border-dashed border-line px-5 py-8 text-center text-ink/65">
      아직 카드가 없어요. 오른쪽 위 <b className="text-primary">+ 추가</b>를 눌러 첫 카드를 만들어요.
      <br />
      <span className="text-sm">카드가 없으면 보는 화면에서는 이 섹션이 숨겨져요.</span>
    </p>
  );
}
