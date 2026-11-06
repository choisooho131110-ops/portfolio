"use server";

import { redirect } from "next/navigation";
import { toKoreanAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null; email: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 적어 주세요.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: toKoreanAuthError(error), email };
  }

  // 로그인은 됐지만 admins 에 없는 계정이면 바로 로그아웃
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "편집 권한이 없는 계정이에요.", email };
  }

  redirect("/edit");
}
