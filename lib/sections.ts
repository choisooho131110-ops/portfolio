import { BadgeCheck, CodeXml, Gamepad2, Trophy, type LucideIcon } from "lucide-react";
import type { SectionTable } from "./types";

type SectionInfo = {
  id: SectionTable; // 화면의 #앵커 이름으로도 사용
  title: string;
  shortTitle: string; // 상단 바 탭에 쓰는 짧은 이름
  icon: LucideIcon;
  /** 섹션 포인트 색 (Tailwind 클래스는 글자 그대로 적어야 빌드에 포함돼요) */
  accent: { text: string; soft: string };
};

export const SECTIONS: SectionInfo[] = [
  {
    id: "awards",
    title: "수상 경력",
    shortTitle: "수상",
    icon: Trophy,
    accent: { text: "text-coral", soft: "bg-coral/10" },
  },
  {
    id: "certificates",
    title: "자격증",
    shortTitle: "자격증",
    icon: BadgeCheck,
    accent: { text: "text-mint", soft: "bg-mint/10" },
  },
  {
    id: "interests",
    title: "관심사",
    shortTitle: "관심사",
    icon: Gamepad2,
    accent: { text: "text-primary", soft: "bg-primary/10" },
  },
  {
    id: "projects",
    title: "내가 만든 작품",
    shortTitle: "작품",
    icon: CodeXml,
    accent: { text: "text-[#a87200]", soft: "bg-sunny/20" },
  },
];

export function getSection(id: SectionTable): SectionInfo {
  return SECTIONS.find((s) => s.id === id)!;
}
