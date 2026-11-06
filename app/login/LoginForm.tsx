"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { error: null, email: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const input =
    "h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none transition " +
    "placeholder:text-ink/35 focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-semibold">이메일</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          defaultValue={state.email}
          placeholder="you@example.com"
          className={input}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-semibold">비밀번호</span>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${input} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-ink/45 hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-coral/10 px-4 py-3 text-[15px] font-medium text-[#c7343a]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white
          transition hover:bg-[#1f5af0] focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none
          disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            로그인 중…
          </>
        ) : (
          <>
            <LogIn className="size-5" aria-hidden />
            로그인
          </>
        )}
      </button>
    </form>
  );
}
