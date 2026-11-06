import type { ItemEdit } from "@/lib/editor";
import { INTEREST_GUIDE as G, shown } from "@/lib/placeholders";
import type { Interest } from "@/lib/types";
import { Card, CardBody, CardImage } from "./Card";
import { CardToolbar } from "./edit/CardToolbar";
import { EmojiPicker } from "./edit/EmojiPicker";
import { ImageUploader } from "./edit/ImageUploader";
import { InlineText } from "./edit/InlineText";

type Props = {
  interest: Interest;
  edit?: ItemEdit<Interest>;
};

export function InterestCard({ interest, edit }: Props) {
  const { emoji, title, description, image_url } = interest;
  const alt = `${title} 사진`;

  if (edit) {
    const save = (patch: Partial<Interest>) => edit.save(patch);
    return (
      <Card
        toolbar={
          <CardToolbar
            isSample={interest.is_sample}
            onDelete={edit.remove}
            onMoveUp={edit.moveUp}
            onMoveDown={edit.moveDown}
            movable
          />
        }
      >
        <ImageUploader src={image_url} alt={alt} guide={G.image} onUpload={edit.uploadImage} onRemove={edit.removeImage} />
        <CardBody>
          <EmojiPicker value={emoji} label="관심사 이모지" onSave={(v) => save({ emoji: v })} />
          <h3 className="mt-2 text-lg leading-snug font-bold">
            <InlineText value={title} placeholder={G.title} label="관심사 제목" onSave={(v) => save({ title: v })} />
          </h3>
          <InlineText
            value={description}
            placeholder={G.description}
            label="설명"
            multiline
            onSave={(v) => save({ description: v })}
            className="leading-relaxed whitespace-pre-line text-ink/80"
          />
        </CardBody>
      </Card>
    );
  }

  const viewTitle = shown(title, G.title, interest.is_sample);
  const viewDescription = shown(description, G.description, interest.is_sample);

  return (
    <Card>
      {image_url && <CardImage src={image_url} alt={alt} />}
      <CardBody>
        <span
          className="flex size-14 items-center justify-center rounded-2xl bg-sunny/25 text-3xl transition-transform
            duration-200 group-hover:-rotate-6 motion-reduce:transition-none"
          aria-hidden
        >
          {emoji}
        </span>
        <h3 className="mt-2 text-lg leading-snug font-bold">{viewTitle}</h3>
        {viewDescription && <p className="leading-relaxed whitespace-pre-line text-ink/80">{viewDescription}</p>}
      </CardBody>
    </Card>
  );
}
