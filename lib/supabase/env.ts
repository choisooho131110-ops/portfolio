// NEXT_PUBLIC_ 변수는 빌드할 때 글자 그대로 바뀌어 들어가므로
// process.env[name] 처럼 쓰지 말고 이렇게 직접 적어야 해요.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseEnv() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 설정이 없어요. .env.local.example 을 복사해 .env.local 을 만들고 " +
        "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 를 채운 뒤 서버를 다시 켜 주세요.",
    );
  }
  return { url, anonKey };
}
