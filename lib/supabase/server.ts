// 서버(서버 컴포넌트, 서버 액션, 라우트 핸들러)에서 쓰는 Supabase
// 요청마다 새로 만들어야 해요. (다른 사람과 로그인 정보가 섞이지 않도록)
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";
import { getSupabaseEnv } from "./env";

export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // 서버 컴포넌트에서는 쿠키를 쓸 수 없어요.
          // 로그인 유지(토큰 갱신)는 proxy/middleware 가 대신 처리하니 무시해도 돼요.
        }
      },
    },
  });
}
