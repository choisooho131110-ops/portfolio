import { CodeXml, ExternalLink, Link as LinkIcon } from "lucide-react";
import type { ItemEdit } from "@/lib/editor";
import { isSafeLink } from "@/lib/links";
import { PROJECT_GUIDE as G, shown } from "@/lib/placeholders";
import type { Project } from "@/lib/types";
import { Card, CardBody, CardImage } from "./Card";
import { CardToolbar } from "./edit/CardToolbar";
import { ImageUploader } from "./edit/ImageUploader";
import { InlineText } from "./edit/InlineText";
import { KeywordEditor } from "./edit/KeywordEditor";

const TAG_COLORS = ["bg-ink/[0.06] text-ink/75"];

type Props = {
  project: Project;
  edit?: ItemEdit<Project>;
};

/** 썸네일이 없을 때: 연한 배경 + 코드 아이콘 */
function ThumbPlaceholder() {
  return (
    <div className="flex h-32 items-center justify-center bg-linear-to-br from-sunny/20 via-primary/5 to-mint/15" aria-hidden>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/80 text-[#a87200] shadow-sm">
        <CodeXml className="size-8" strokeWidth={2} />
      </span>
    </div>
  );
}

/** 열어보기 ↗ (항상 새 탭) */
function OpenLink({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex h-11 w-fit items-center gap-1.5 rounded-xl bg-ink px-4 text-[15px] font-bold text-white transition hover:bg-primary focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
    >
      열어보기
      <ExternalLink className="size-4" aria-hidden />
      <span className="sr-only">: {title} (새 탭에서 열려요)</span>
    </a>
  );
}

export function ProjectCard({ project, edit }: Props) {
  const { title, summary, tags, link_url, image_url } = project;
  const alt = `${title} 작품 화면`;
  const hasLink = !!link_url && isSafeLink(link_url);

  if (edit) {
    const save = (patch: Partial<Project>) => edit.save(patch);
    return (
      <Card
        toolbar={
          <CardToolbar
            isSample={project.is_sample}
            onDelete={edit.remove}
            onMoveUp={edit.moveUp}
            onMoveDown={edit.moveDown}
            movable
          />
        }
      >
        <ImageUploader src={image_url} alt={alt} guide={G.image} onUpload={edit.uploadImage} onRemove={edit.removeImage} />
        <CardBody>
          <h3 className="text-lg leading-snug font-bold">
            <InlineText value={title} placeholder={G.title} label="작품 이름" maxLength={60} onSave={(v) => save({ title: v })} />
          </h3>
          <InlineText
            value={summary}
            placeholder={G.summary}
            label="한 줄 설명"
            maxLength={200}
            onSave={(v) => save({ summary: v })}
            className="leading-relaxed text-ink/80"
          />
          <KeywordEditor
            keywords={tags}
            chipColors={TAG_COLORS}
            onSave={(t) => save({ tags: t })}
            label="태그"
            prefix=""
            placeholder="예: HTML"
            hint={G.tag}
            align="left"
            size="sm"
          />
          <div className="mt-1 flex items-start gap-2 text-sm text-ink/65">
            <LinkIcon className="mt-3.5 size-4 shrink-0" aria-hidden />
            <InlineText
              value={link_url}
              placeholder={G.link_url}
              label="작품 주소"
              maxLength={300}
              onSave={(v) => save({ link_url: v })}
              className="font-mono text-sm break-all"
            />
          </div>
          {hasLink && <OpenLink href={link_url} title={title} />}
        </CardBody>
      </Card>
    );
  }

  const viewTitle = shown(title, G.title, project.is_sample);
  const viewSummary = shown(summary, G.summary, project.is_sample);

  return (
    <Card>
      {image_url ? <CardImage src={image_url} alt={alt} /> : <ThumbPlaceholder />}
      <CardBody>
        <h3 className="text-lg leading-snug font-bold">{viewTitle}</h3>
        {viewSummary && <p className="leading-relaxed text-ink/80">{viewSummary}</p>}
        {tags.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="사용한 기술">
            {tags.map((t) => (
              <li key={t} className="rounded-full bg-ink/[0.06] px-3 py-1 text-sm font-semibold text-ink/75">
                {t}
              </li>
            ))}
          </ul>
        )}
        {hasLink && (
          <div className="mt-auto pt-3">
            <OpenLink href={link_url} title={title} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
