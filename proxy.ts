// /edit 와 /login 에 들어오기 전에 먼저 실행돼요. (Next 16에서 middleware → proxy 로 이름이 바뀜)
//  1) 로그인 유지: 만료된 로그인 토큰을 새로 바꿔 쿠키에 저장
//  2) /edit: 관리자가 아니면 /login 으로 보냄
//  3) /login: 이미 관리자로 로그인했으면 /edit 으로 보냄
// ※ 이건 1차 문지기예요. /edit 페이지와 DB(RLS)에서도 한 번 더 검사해요.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/types";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const admin = await getAdminUser(supabase);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/edit") && !admin) {
    return redirectKeepingCookies(request, response, "/login");
  }
  if (pathname === "/login" && admin) {
    return redirectKeepingCookies(request, response, "/edit");
  }
  return response;
}

/** 다른 주소로 보내되, 방금 갱신된 로그인 쿠키는 잃어버리지 않게 */
function redirectKeepingCookies(request: NextRequest, from: NextResponse, to: string) {
  const redirect = NextResponse.redirect(new URL(to, request.url));
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}

export const config = {
  matcher: ["/edit/:path*", "/login"],
};
