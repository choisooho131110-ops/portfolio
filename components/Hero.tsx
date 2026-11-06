import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import type { ProfileEdit } from "@/lib/editor";
import { PROFILE_GUIDE } from "@/lib/placeholders";
import type { Profile } from "@/lib/types";
import { ImageUploader } from "./edit/ImageUploader";
import { InlineText } from "./edit/InlineText";
import { KeywordEditor } from "./edit/KeywordEditor";

// 키워드 칩 색을 돌아가며 사용 (글자는 배경과 대비 4.5:1 이상이 되도록 조금 진하게)
const CHIP_COLORS = [
  "bg-sunny/35 text-ink",
  "bg-primary/10 text-[#1f55d6]",
  "bg-mint/15 text-[#0e6b63]",
  "bg-coral/10 text-[#c4313a]",
];

type Props = {
  profile: Pick<Profile, "name" | "tagline" | "keywords" | "avatar_url">;
  /** 있으면 편집 화면 */
  edit?: ProfileEdit;
};

export function Hero({ profile, edit }: Props) {
  const { name, tagline, keywords, avatar_url } = profile;

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <HeroShapes />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 pb-14 text-center md:pt-20 md:pb-20">
        <Avatar name={name} src={avatar_url} />

        {edit ? (
          <>
            <ImageUploader
              variant="avatar"
              src={avatar_url}
              alt="프로필 사진"
              guide={PROFILE_GUIDE.avatar}
              onUpload={edit.uploadAvatar}
              onRemove={edit.removeAvatar}
            />
            <div className="mt-5 w-full max-w-md">
              <InlineText
                value={name}
                placeholder={PROFILE_GUIDE.name}
                label="이름 또는 닉네임"
                maxLength={30}
                onSave={(v) => edit.save({ name: v })}
                className="text-lg font-bold text-primary"
                inputClassName="text-center"
              />
            </div>
            <h1 className="mt-3 w-full max-w-2xl text-[26px] leading-snug font-extrabold tracking-tight text-balance md:text-4xl md:leading-tight">
              <InlineText
                value={tagline}
                placeholder={PROFILE_GUIDE.tagline}
                label="한 줄 소개"
                maxLength={100}
                onSave={(v) => edit.save({ tagline: v })}
                className="w-full justify-center text-center"
                inputClassName="text-center text-lg font-bold"
              />
            </h1>
            <KeywordEditor keywords={keywords} chipColors={CHIP_COLORS} onSave={(k) => edit.save({ keywords: k })} />
          </>
        ) : (
          <>
            {name && <p className="mt-5 text-lg font-bold text-primary">{name}</p>}
            <h1
              className={`${name ? "mt-2" : "mt-6"} max-w-2xl text-[26px] leading-snug font-extrabold tracking-tight
                text-balance md:text-4xl md:leading-tight`}
            >
              {tagline}
            </h1>
            {keywords.length > 0 && (
              <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="키워드">
                {keywords.map((k, i) => (
                  <li
                    key={k}
                    className={`rounded-full px-4 py-2 text-base font-semibold ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                  >
                    #{k}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const ring = "size-28 rounded-full ring-4 ring-white shadow-[0_8px_24px_rgba(47,107,255,0.18)] md:size-32";

  if (src) {
    return (
      <div className={`relative overflow-hidden ${ring}`}>
        <Image src={src} alt={name ? `${name} 프로필 사진` : "프로필 사진"} fill sizes="128px" className="object-cover" priority />
      </div>
    );
  }

  // 사진이 없으면: 이름이 있으면 첫 글자, 없으면 게임패드 아이콘
  return (
    <div
      className={`flex items-center justify-center bg-linear-to-br from-primary to-[#5b8cff] text-white ${ring}`}
      aria-hidden
    >
      {name ? (
        <span className="text-5xl font-extrabold">{name.trim().charAt(0)}</span>
      ) : (
        <Gamepad2 className="size-14" strokeWidth={1.8} />
      )}
    </div>
  );
}

/** 배경의 동글동글한 도형들 (흐릿하게, 장식용) */
function HeroShapes() {
  return (
    // 아래쪽을 서서히 투명하게 해서 도형이 칼같이 잘려 보이지 않게
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 mask-b-from-60% mask-b-to-100%"
    >
      <div className="absolute -top-16 -left-20 size-56 rounded-full bg-sunny/40 blur-3xl md:size-80" />
      <div className="absolute top-10 -right-16 size-44 rotate-12 rounded-[2.5rem] bg-primary/20 blur-2xl md:right-10 md:size-64" />
      <div className="absolute bottom-6 left-[12%] size-16 rounded-full bg-coral/25 blur-xl md:size-24" />
      <div className="absolute -bottom-10 right-[18%] size-28 -rotate-12 rounded-3xl bg-mint/25 blur-2xl md:size-40" />
      {/* 또렷한 작은 도형 몇 개로 게임 느낌 포인트 */}
      <div className="absolute top-8 left-[18%] size-3 rounded-full bg-sunny md:size-4" />
      <div className="absolute top-24 right-[14%] size-4 rotate-45 rounded-[5px] border-2 border-primary/40 md:size-5" />
      <div className="absolute bottom-12 right-[8%] size-3 rounded-full bg-coral/60" />
      <div className="absolute bottom-20 left-[6%] size-4 rounded-full border-2 border-mint/60" />
    </div>
  );
}
