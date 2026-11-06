import type { PortfolioData } from "@/lib/data";
import type { PortfolioEditor } from "@/lib/editor";
import { getSection } from "@/lib/sections";
import type { SectionTable } from "@/lib/types";
import { AwardCard } from "./AwardCard";
import { CertificateCard } from "./CertificateCard";
import { AddButton } from "./edit/AddButton";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { InterestCard } from "./InterestCard";
import { ProjectCard } from "./ProjectCard";
import { EmptySection, Section } from "./Section";
import { TopBar } from "./TopBar";

type Props = {
  data: PortfolioData;
  /** 있으면 편집 화면: 편집 도구가 켜지고, 빈 섹션도 보여요 */
  editor?: PortfolioEditor;
};

/** 포트폴리오 화면 전체 (보는 화면과 편집 화면이 같이 씀) */
export function PortfolioView({ data, editor }: Props) {
  const { profile, awards, certificates, interests, projects } = data;

  // 보는 화면: 항목이 0개인 섹션은 숨김 / 편집 화면: 항상 보임
  const counts: Record<SectionTable, number> = {
    awards: awards.length,
    certificates: certificates.length,
    interests: interests.length,
    projects: projects.length,
  };
  const visible = (Object.keys(counts) as SectionTable[]).filter((s) => editor || counts[s] > 0);
  const show = (s: SectionTable) => visible.includes(s);

  const addButton = (s: SectionTable) =>
    editor && <AddButton label={getSection(s).title} onAdd={() => editor.add(s)} />;
  const empty = (s: SectionTable) => editor && counts[s] === 0 && <EmptySection />;

  return (
    <>
      <TopBar name={profile.name} sections={visible} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero profile={profile} edit={editor?.profile} />
        <div className="mx-auto max-w-5xl px-4 pb-8">
          {show("awards") && (
            <Section section="awards" count={awards.length} action={addButton("awards")}>
              {empty("awards")}
              {awards.map((a) => (
                <AwardCard key={a.id} award={a} edit={editor?.award(a)} />
              ))}
            </Section>
          )}
          {show("certificates") && (
            <Section section="certificates" count={certificates.length} action={addButton("certificates")}>
              {empty("certificates")}
              {certificates.map((c) => (
                <CertificateCard key={c.id} certificate={c} edit={editor?.certificate(c)} />
              ))}
            </Section>
          )}
          {show("interests") && (
            <Section section="interests" count={interests.length} action={addButton("interests")}>
              {empty("interests")}
              {interests.map((it, i) => (
                <InterestCard key={it.id} interest={it} edit={editor?.interest(it, i, interests.length)} />
              ))}
            </Section>
          )}
          {show("projects") && (
            <Section section="projects" count={projects.length} action={addButton("projects")}>
              {empty("projects")}
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} edit={editor?.project(p, i, projects.length)} />
              ))}
            </Section>
          )}
        </div>
      </main>
      <Footer name={profile.name} />
    </>
  );
}
