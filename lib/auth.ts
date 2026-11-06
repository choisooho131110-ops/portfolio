import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * 로그인했고 + admins 테이블에 등록된 사람이면 그 사용자를, 아니면 null.
 * getUser()는 Supabase 서버에 직접 물어봐서 쿠키 위조로 속일 수 없어요.
 */
export async function getAdminUser(supabase: SupabaseClient<Database>): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return null;
  return user;
}

/** Supabase 로그인 오류 → 한국어 안내 */
export function toKoreanAuthError(error: { code?: string; status?: number; message: string }): string {
  switch (error.code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 맞지 않아요.";
    case "email_not_confirmed":
      return "이메일 인증이 아직 안 된 계정이에요. Supabase에서 계정을 확인해 주세요.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "너무 여러 번 시도했어요. 잠시 후 다시 해 주세요.";
    case "user_banned":
      return "사용이 막힌 계정이에요.";
  }
  if (error.status === 429) return "너무 여러 번 시도했어요. 잠시 후 다시 해 주세요.";
  if (!error.status || error.status >= 500) return "로그인 서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.";
  return "로그인에 실패했어요. 다시 시도해 주세요.";
}
