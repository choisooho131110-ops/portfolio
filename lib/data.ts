import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Award, Certificate, Database, Interest, Profile, Project } from "./types";

export type PortfolioData = {
  profile: Profile;
  awards: Award[];
  certificates: Certificate[];
  interests: Interest[];
  projects: Project[];
};

/** 사이트 제목·공유 미리보기용: 이름과 한 줄 소개만 (실패해도 기본값) */
export async function getProfileSummary(supabase: SupabaseClient<Database>) {
  const { data } = await supabase.from("profile").select("name, tagline").eq("id", 1).maybeSingle();
  return { name: data?.name ?? "", tagline: data?.tagline ?? "" };
}

/** 프로필 + 네 섹션을 한 번에 읽어요 (동시에 요청해서 빠르게) */
export async function getPortfolio(supabase: SupabaseClient<Database>): Promise<PortfolioData> {
  const [profile, awards, certificates, interests, projects] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
    // 수상·자격증: 날짜 최신순. 날짜를 아직 안 고른 카드(새로 만든 카드)는 맨 위
    supabase
      .from("awards")
      .select("*")
      .order("awarded_on", { ascending: false, nullsFirst: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("certificates")
      .select("*")
      .order("acquired_on", { ascending: false, nullsFirst: true })
      .order("created_at", { ascending: false }),
    // 관심사·작품: 주인이 정한 순서 (sort_order 작은 게 위)
    supabase
      .from("interests")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const error = profile.error ?? awards.error ?? certificates.error ?? interests.error;
  if (error) throw new Error(`DB 읽기 실패: ${error.message}`);
  if (!profile.data) {
    throw new Error("profile 데이터가 없어요. Supabase SQL Editor에서 supabase/schema.sql 을 실행했는지 확인해 주세요.");
  }

  // projects 테이블이 아직 없으면(002_projects.sql 실행 전) 작품 섹션만 비워 두고 나머지는 보여줘요
  if (projects.error) {
    const missing = projects.error.code === "PGRST205" || projects.error.code === "42P01";
    if (!missing) throw new Error(`DB 읽기 실패: ${projects.error.message}`);
    console.warn("projects 테이블이 없어요. supabase/002_projects.sql 을 실행해 주세요.");
  }

  return {
    profile: profile.data,
    awards: awards.data ?? [],
    certificates: certificates.data ?? [],
    interests: interests.data ?? [],
    projects: projects.data ?? [],
  };
}
