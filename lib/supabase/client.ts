// 브라우저(클라이언트 컴포넌트)에서 쓰는 Supabase
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
