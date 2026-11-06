// 카카오톡·메신저에 주소를 붙여넣었을 때 보이는 공유 미리보기 이미지
// 단색 배경 + 이름 + 한 줄 소개 (캐릭터 그림 없이)
import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { getProfileSummary } from "@/lib/data";
import { createPublicClient } from "@/lib/supabase/public";

export const alt = "포트폴리오 미리보기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 이미지에 들어갈 글자만 담은 한글 폰트를 받아와요 (Google Fonts 의 text= 기능) */
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    return await (await fetch(fontUrl)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  await connection(); // 이름을 바꾸면 미리보기도 바뀌도록 접속할 때마다 만들기

  let name = "";
  let tagline = "";
  try {
    ({ name, tagline } = await getProfileSummary(createPublicClient()));
  } catch {
    // DB를 못 읽어도 기본 이미지는 만들어요
  }
  const title = name ? `${name}의 포트폴리오` : "나의 포트폴리오";
  const sub = tagline.length > 40 ? `${tagline.slice(0, 40)}…` : tagline;

  const font = await loadKoreanFont(`${title}${sub}PORTFOLIO`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#2F6BFF",
          color: "#FFFFFF",
          fontFamily: font ? "Noto Sans KR" : "sans-serif",
          position: "relative",
        }}
      >
        {/* 동글동글한 도형 장식 */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, borderRadius: 9999, background: "rgba(255,255,255,0.10)" }} />
        <div style={{ position: "absolute", bottom: -90, right: 260, width: 220, height: 220, borderRadius: 64, background: "rgba(255,201,60,0.35)", transform: "rotate(12deg)" }} />
        <div style={{ position: "absolute", top: 90, right: 150, width: 34, height: 34, borderRadius: 9999, background: "#FFC93C" }} />
        <div style={{ position: "absolute", bottom: 120, left: 96, width: 22, height: 22, borderRadius: 9999, background: "#FF5A5F" }} />

        <div style={{ fontSize: 30, letterSpacing: 8, opacity: 0.8 }}>PORTFOLIO</div>
        <div style={{ fontSize: 84, marginTop: 16, lineHeight: 1.15 }}>{title}</div>
        {sub && <div style={{ fontSize: 38, marginTop: 28, opacity: 0.92, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Noto Sans KR", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
