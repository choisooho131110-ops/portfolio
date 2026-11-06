import { CalendarDays, Trophy } from "lucide-react";
import type { ItemEdit } from "@/lib/editor";
import { formatDate } from "@/lib/format";
import { AWARD_GUIDE as G, shown } from "@/lib/placeholders";
import type { Award } from "@/lib/types";
import { Card, CardBody, CardImage } from "./Card";
import { CardToolbar } from "./edit/CardToolbar";
import { ImageUploader } from "./edit/ImageUploader";
import { InlineDate } from "./edit/InlineDate";
import { InlineText } from "./edit/InlineText";

type Props = {
  award: Award;
  /** 있으면 편집 화면 (편집 도구가 켜짐) */
  edit?: ItemEdit<Award>;
};

export function AwardCard({ award, edit }: Props) {
  const { title, prize, organizer, awarded_on, description, image_url } = award;
  const alt = `${title} 사진`;

  if (edit) {
    const save = (patch: Partial<Award>) => edit.save(patch);
    return (
      <Card toolbar={<CardToolbar isSample={award.is_sample} onDelete={edit.remove} />}>
        <ImageUploader src={image_url} alt={alt} guide={G.image} onUpload={edit.uploadImage} onRemove={edit.removeImage} />
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            <Trophy className="size-5 shrink-0 text-coral" aria-hidden />
            <InlineText
              value={prize}
              placeholder={G.prize}
              label="상 이름"
              onSave={(v) => save({ prize: v })}
              className="font-bold text-coral"
            />
          </div>
          <InlineDate value={awarded_on} placeholder={G.awarded_on} label="상 받은 날짜" onSave={(v) => save({ awarded_on: v })} />
          <h3 className="mt-1 text-lg leading-snug font-bold">
            <InlineText value={title} placeholder={G.title} label="대회·행사 이름" onSave={(v) => save({ title: v })} />
          </h3>
          <InlineText
            value={organizer}
            placeholder={G.organizer}
            label="주최 기관"
            onSave={(v) => save({ organizer: v })}
            className="text-[15px] text-ink/65"
          />
          <InlineText
            value={description}
            placeholder={G.description}
            label="설명"
            multiline
            onSave={(v) => save({ description: v })}
            className="mt-1 leading-relaxed whitespace-pre-line text-ink/80"
          />
        </CardBody>
      </Card>
    );
  }

  const s = (v: string, guide: string) => shown(v, guide, award.is_sample);
  const view = { title: s(title, G.title), prize: s(prize, G.prize), organizer: s(organizer, G.organizer), description: s(description, G.description) };

  return (
    <Card>
      {image_url && <CardImage src={image_url} alt={alt} />}
      <CardBody>
        <div className="flex flex-wrap items-center gap-2">
          {view.prize && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#d93a40] px-3 py-1 text-sm font-bold text-white">
              <Trophy className="size-4" aria-hidden />
              {view.prize}
            </span>
          )}
          {awarded_on && (
            <span className="inline-flex items-center gap-1 text-sm text-ink/65">
              <CalendarDays className="size-4" aria-hidden />
              <time dateTime={awarded_on}>{formatDate(awarded_on)}</time>
            </span>
          )}
        </div>
        <h3 className="mt-1 text-lg leading-snug font-bold">{view.title}</h3>
        {view.organizer && <p className="text-[15px] text-ink/65">{view.organizer}</p>}
        {view.description && <p className="mt-1 leading-relaxed whitespace-pre-line text-ink/80">{view.description}</p>}
      </CardBody>
    </Card>
  );
}
