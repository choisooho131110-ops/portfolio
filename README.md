# 나의 포트폴리오

수상 경력 · 자격증 · 관심사 · 내가 만든 작품을 보여주는 개인 포트폴리오 웹앱이에요.
사이트 안에서 바로 글을 고치고, 카드를 추가·삭제하고, 사진을 올릴 수 있어요. (편집은 주인만 가능)

| 주소 | 누가 | 하는 일 |
|---|---|---|
| `/` | 누구나 | 포트폴리오 보기 |
| `/login` | 주인 | 로그인 (사이트 어디에도 링크가 없어요. 주소창에 직접 입력) |
| `/edit` | 주인 | 보면서 바로 고치는 편집 화면 |
| `/projects/pokedex.html` | 누구나 | 내가 만든 미니 도감 |

만든 도구: Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase (DB·로그인·사진 저장) · Vercel (배포)

---

## 1. 처음 설정하기

> ⚠️ Supabase, Vercel, GitHub 가입은 서비스마다 나이 제한이 있을 수 있어요.
> **부모님이나 보호자와 함께** 가입하고 설정하는 걸 추천해요.

1. [supabase.com](https://supabase.com) 에서 새 프로젝트를 만들어요.
2. **SQL Editor** → **New query** 에 [`supabase/schema.sql`](supabase/schema.sql) 전체를 붙여넣고 **Run**.
   - 예전에 `schema.sql` 을 이미 실행했다면, 작품 섹션용 [`supabase/002_projects.sql`](supabase/002_projects.sql) 만 실행해요.
     (`schema.sql` 을 다시 실행하면 지운 예시 카드가 다시 생길 수 있어요)
3. **Authentication → Sign In / Providers** 에서 **"Allow new users to sign up" 끄기** (아무나 가입 못 하게).
4. **Authentication → Users → Add user → Create new user** 로 내 계정(이메일+비밀번호)을 만들어요. "Auto Confirm User" 체크.
5. 만든 계정의 **User UID** 를 복사해서 SQL Editor 에서 실행 (따옴표 꼭!):
   ```sql
   insert into public.admins (user_id) values ('복사한-UID') on conflict do nothing;
   ```
6. **Project Settings → API Keys** 에서 프로젝트 주소와 **Publishable key**(또는 anon key)를 복사해요.
   `.env.local.example` 을 복사해 `.env.local` 을 만들고 붙여넣어요.
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://○○○.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한-키
   ```
   - ⚠️ **secret / service_role 키는 절대** 코드나 GitHub 에 넣지 않아요.
7. 터미널에서:
   ```bash
   npm install
   npm run dev
   ```
   → http://localhost:3000 (보기) · http://localhost:3000/login (로그인)

## 2. 편집하는 방법

`/login` 에서 로그인하면 `/edit` 로 이동해요. 보는 화면과 똑같은 모양 위에 편집 도구가 얹혀 있어요.

- **글 고치기**: 점선으로 표시된 글자를 누르면 입력창으로 바뀌어요. `Enter` 저장 · `Esc` 취소 (여러 줄 칸은 `Ctrl+Enter` 저장)
- **카드 추가**: 섹션 제목 오른쪽 `+ 추가` → 안내 문구가 채워진 새 카드가 맨 위에 생겨요
- **카드 삭제**: 카드 위쪽 `🗑 삭제` → 확인창
- **사진**: `사진 올리기` / `사진 바꾸기` / 🗑 — 올리기 전에 자동으로 줄이고(1600px, 약 500KB), 사진 속 위치 정보도 지워요
- **키워드·태그**: `×` 로 지우고 `+ 키워드` / `+ 태그` 로 추가
- **순서**: 관심사·작품 카드는 `↑` `↓` 로 순서를 바꿔요 (수상·자격증은 날짜 최신순 자동 정렬)
- **작품 링크**: `/` 로 시작하는 사이트 안 주소나 `https://` 주소만 저장돼요
- "예시" 배지가 붙은 카드는 아직 안내 문구 그대로인 카드예요. 한 번 저장하면 배지가 사라져요.
- 안내 문구 그대로 남은 칸은 보는 화면에서 자동으로 숨겨져요.

고친 내용은 보는 화면 `/` 에 바로 반영돼요.

## 3. 새 작품 올리기

1. 작품 HTML 파일을 `public/projects/` 폴더에 넣어요. (예: `public/projects/typing-game.html`)
2. 편집 화면 → 내가 만든 작품 `+ 추가` → 링크 칸에 `/projects/typing-game.html` 입력.
3. 작품 화면을 캡처해서 썸네일로 올려요.

## 4. 폴더 구조

```
app/
  page.tsx              보는 화면 /
  login/                로그인 /login
  edit/                 편집 화면 /edit
  opengraph-image.tsx   카톡 등에 공유할 때 보이는 미리보기 그림
  error.tsx, not-found.tsx
components/
  Hero, TopBar, Section, …Card.tsx   보는 화면·편집 화면이 같이 쓰는 부품
  edit/                 편집 도구 (InlineText, ImageUploader, ConfirmDialog, Toast …)
lib/
  supabase/             DB 연결 (브라우저용 · 서버용 · 공개 읽기용)
  data.ts               DB에서 내용 읽기
  images.ts             사진 압축 · 업로드 · 삭제
  placeholders.ts       "무엇을 쓰면 되는지" 안내 문구
proxy.ts                /edit 지키기 (Next 16 에서 middleware → proxy 로 이름이 바뀜)
supabase/               DB 설정 SQL
public/projects/        내가 만든 작품 파일
```

## 5. 보안은 어떻게 지켜지나요?

- **편집은 나만**: 화면에서 버튼을 숨기는 것뿐 아니라, Supabase 의 **RLS(행 수준 보안)** 가 `admins` 에 등록된 계정만 고치기를 허락해요.
  로그인하지 않은 사람이 개발자도구로 직접 DB 를 고치려 해도 거부돼요.
- `/edit` 은 3겹으로 막아요: `proxy.ts` → 편집 페이지 안 검사 → DB 의 RLS.
- 브라우저에 들어가는 Publishable(anon) 키는 원래 공개돼도 되는 키예요. 위험한 건 secret/service_role 키예요.

## 6. 사이트에 올리기 전에 꼭! (개인정보)

포트폴리오는 누구나 볼 수 있는 공개 사이트예요. 아래 정보는 올리지 않거나 가려요.

- 집 주소, 전화번호, 개인 이메일
- 학교 이름 + 학년 + 반 (조합되면 나를 쉽게 찾을 수 있어요)
- 상장·자격증 사진 속 **생년월일, 자격증 번호, 주민번호 일부**
- 교복 명찰이 보이는 사진, 집 근처가 드러나는 사진
- 실명 대신 **닉네임**을 써도 괜찮아요
- 게임·애니메이션 캐릭터 그림은 저작권이 있어요. 직접 찍은 사진을 쓰는 게 안전해요.

## 7. 명령어

| 명령어 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 켜기 (고치면 바로 반영) |
| `npm run build` | 배포용으로 만들기 (오류 확인용으로도 좋아요) |
| `npm run start` | 만든 배포용 버전 실행 |
| `npm run lint` | 코드 검사 |
