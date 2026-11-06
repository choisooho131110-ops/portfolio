import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EditablePortfolio } from "@/components/edit/EditablePortfolio";
import { EditBar } from "@/components/edit/EditBar";
import { LoadError } from "@/components/LoadError";
import { PortfolioSkeleton } from "@/components/PortfolioSkeleton";
import { getAdminUser } from "@/lib/auth";
import { getPortfolio, type PortfolioData } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "편집 모드",
  robots: { index: false, follow: false },
};

export default function EditPage() {
  return (
    // --edit-bar: 편집 띠 높이. 상단 바·섹션 위치가 이만큼 아래로 밀려요
    <div className="flex flex-1 flex-col [--edit-bar:3.5rem]">
      <Suspense fallback={<PortfolioSkeleton />}>
        <EditPortfolio />
      </Suspense>
    </div>
  );
}

async function EditPortfolio() {
  const supabase = await createClient();

  // proxy 가 이미 막지만, 페이지에서도 한 번 더 확인 (2차 문지기)
  const admin = await getAdminUser(supabase);
  if (!admin) redirect("/login");

  let data: PortfolioData;
  try {
    data = await getPortfolio(supabase);
  } catch (e) {
    console.error(e);
    return <LoadError detail={e instanceof Error ? e.message : String(e)} />;
  }

  return (
    <>
      <EditBar />
      <EditablePortfolio initial={data} />
    </>
  );
}
