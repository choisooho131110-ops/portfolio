import { BadgeCheck, CalendarDays } from "lucide-react";
import type { ItemEdit } from "@/lib/editor";
import { formatDate } from "@/lib/format";
import { CERTIFICATE_GUIDE as G, shown } from "@/lib/placeholders";
import type { Certificate } from "@/lib/types";
import { Card, CardBody, CardImage } from "./Card";
import { CardToolbar } from "./edit/CardToolbar";
import { ImageUploader } from "./edit/ImageUploader";
import { InlineDate } from "./edit/InlineDate";
import { InlineText } from "./edit/InlineText";

type Props = {
  certificate: Certificate;
  edit?: ItemEdit<Certificate>;
};

function Badge() {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint" aria-hidden>
      <BadgeCheck className="size-6" strokeWidth={2.2} />
    </span>
  );
}

export function CertificateCard({ certificate, edit }: Props) {
  const { name, issuer, acquired_on, memo, image_url } = certificate;
  const alt = `${name} 자격증 사진`;

  if (edit) {
    const save = (patch: Partial<Certificate>) => edit.save(patch);
    return (
      <Card toolbar={<CardToolbar isSample={certificate.is_sample} onDelete={edit.remove} />}>
        <ImageUploader src={image_url} alt={alt} guide={G.image} onUpload={edit.uploadImage} onRemove={edit.removeImage} />
        <CardBody>
          <div className="flex items-start gap-3">
            <Badge />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="text-lg leading-snug font-bold">
                <InlineText value={name} placeholder={G.name} label="자격증 이름" onSave={(v) => save({ name: v })} />
              </h3>
              <InlineText
                value={issuer}
                placeholder={G.issuer}
                label="발급 기관"
                onSave={(v) => save({ issuer: v })}
                className="text-[15px] text-ink/65"
              />
            </div>
          </div>
          <InlineDate value={acquired_on} placeholder={G.acquired_on} label="취득일" prefix="취득" onSave={(v) => save({ acquired_on: v })} />
          <InlineText
            value={memo}
            placeholder={G.memo}
            label="메모"
            multiline
            onSave={(v) => save({ memo: v })}
            className="leading-relaxed whitespace-pre-line text-ink/80"
          />
        </CardBody>
      </Card>
    );
  }

  const s = (v: string, guide: string) => shown(v, guide, certificate.is_sample);
  const view = { name: s(name, G.name), issuer: s(issuer, G.issuer), memo: s(memo, G.memo) };

  return (
    <Card>
      {image_url && <CardImage src={image_url} alt={alt} />}
      <CardBody>
        <div className="flex items-start gap-3">
          <Badge />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-snug font-bold">{view.name}</h3>
            {view.issuer && <p className="mt-0.5 text-[15px] text-ink/65">{view.issuer}</p>}
          </div>
        </div>
        {acquired_on && (
          <p className="inline-flex items-center gap-1 text-sm text-ink/65">
            <CalendarDays className="size-4" aria-hidden />
            취득 <time dateTime={acquired_on}>{formatDate(acquired_on)}</time>
          </p>
        )}
        {view.memo && <p className="leading-relaxed whitespace-pre-line text-ink/80">{view.memo}</p>}
      </CardBody>
    </Card>
  );
}
