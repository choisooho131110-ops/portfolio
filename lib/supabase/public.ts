// 보는 사람용 화면에서 "읽기만" 할 때 쓰는 Supabase
// 로그인 정보(쿠키)가 필요 없어서 누구에게나 같은 내용을 보여줘요.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { getSupabaseEnv } from "./env";

export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
