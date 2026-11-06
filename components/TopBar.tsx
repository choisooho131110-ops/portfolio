import { Gamepad2 } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import type { SectionTable } from "@/lib/types";

type Props = {
  name: string;
  /** 내용이 있어서 화면에 보이는 섹션만 바로가기에 표시 */
  sections: SectionTable[];
};

export function TopBar({ name, sections }: Props) {
  const links = SECTIONS.filter((s) => sections.includes(s.id));
  const title = name || "나의 포트폴리오";
  // 탭이 많으면 휴대폰에서는 이름을 숨기고 아이콘만 (이름은 바로 아래 첫 화면에 크게 나와요)
  const compact = links.length >= 4;

  return (
    <header className="sticky top-[var(--edit-bar,0px)] z-30 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4">
        <a
          href="#top"
          aria-label={compact ? `${title} — 맨 위로` : undefined}
          className="flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-lg font-extrabold tracking-tight sm:min-w-0 sm:shrink"
        >
          <Gamepad2 className="size-6 shrink-0 text-primary" aria-hidden />
          <span className={`truncate ${compact ? "hidden sm:inline" : ""}`}>{title}</span>
        </a>

        {links.length > 0 && (
          <nav aria-label="섹션 바로가기" className="ml-auto shrink-0">
            <ul className="flex items-center">
              {links.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-11 items-center rounded-full px-2.5 text-[15px] font-semibold text-ink/70
                      transition-colors hover:bg-primary/10 hover:text-primary sm:px-3 md:px-4 md:text-base"
                  >
                    {s.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
