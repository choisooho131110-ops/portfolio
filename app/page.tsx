import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { LoadError } from "@/components/LoadError";
import { PortfolioSkeleton } from "@/components/PortfolioSkeleton";
import { PortfolioView } from "@/components/PortfolioView";
import { getPortfolio, getProfileSummary, type PortfolioData } from "@/lib/data";
import { createPublicClient } from "@/lib/supabase/public";

/** 사이트 제목·설명: DB의 이름과 한 줄 소개로 만들어요 */
export async function generateMetadata(): Promise<Metadata> {
  await connection();
  try {
    const { name, tagline } = await getProfileSummary(createPublicClient());
    const title = name ? `${name}의 포트폴리오` : "나의 포트폴리오";
    const description = tagline || "수상 경력, 자격증, 관심사, 내가 만든 작품을 모아 둔 포트폴리오";
    return {
      title: { absolute: title },
      description,
      openGraph: { title, description, type: "website", locale: "ko_KR" },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return {};
  }
}

export default function Home() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <Portfolio />
    </Suspense>
  );
}

async function Portfolio() {
  // 접속할 때마다 DB를 새로 읽어서 항상 최신 내용을 보여줘요
  await connection();

  let data: PortfolioData;
  try {
    data = await getPortfolio(createPublicClient());
  } catch (e) {
    console.error(e);
    return <LoadError detail={e instanceof Error ? e.message : String(e)} />;
  }
  return <PortfolioView data={data} />;
}
