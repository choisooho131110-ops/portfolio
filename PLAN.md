# 개인 포트폴리오 웹앱 — 개발 계획서 (PLAN.md)

> 이 파일은 Claude Code에게 주는 설계도예요.
> 빈 폴더에 이 파일을 넣고 Claude Code에서 이렇게 말하면 돼요:
> **"PLAN.md를 읽고 Phase 0부터 순서대로 진행해줘. 각 Phase가 끝나면 확인할 수 있게 알려줘."**
>
> 📁 같은 폴더에 `public/projects/pokedex.html` (내가 만든 포켓몬 도감)도 함께 넣어 두세요.

---

## 1. 프로젝트 한눈에 보기

| 항목 | 내용 |
|---|---|
| 주인 | 중학생 남학생 (게임, 특히 닌텐도 게임을 좋아함) |
| 목적 | 수상 경력 · 자격증 · 관심사 · **내가 만든 작품**을 보여주는 개인 포트폴리오 |
| 형태 | 웹앱 (휴대폰 우선 반응형) |
| 화면 | ① 보는 사람용 화면 `/` ② 로그인 `/login` ③ 편집 화면 `/edit` (주인만) ④ 작품 페이지 `/projects/pokedex.html` (누구나) |
| 핵심 기능 | 사이트 안에서 글 수정, 활동 추가/삭제, 사진 업로드/교체 |
| 초기 내용 | 한 줄 소개 + 키워드만 실제 내용, 나머지는 "무엇을 쓰면 되는지" 안내 문구 |

---

## 2. 기술 스택 (Claude Code는 이대로 사용)

- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** — 스타일
- **Supabase** — 데이터베이스(Postgres), 로그인(Auth), 사진 저장(Storage)
  - 무료 요금제로 충분함
- **lucide-react** — 아이콘
- **browser-image-compression** — 사진 업로드 전 자동 압축
- **Pretendard** 폰트 (한글용, CDN 또는 `next/font/local`)
- 배포: **Vercel** (무료)

> 왜 Supabase? "편집은 나만 가능"하려면 로그인과 서버 쪽 권한 검사가 꼭 필요해요.
> 브라우저(localStorage)에만 저장하면 다른 사람 휴대폰에서는 내 글이 안 보여요.

---

## 3. 디자인 가이드

### 3-1. 컨셉
**"밝고 경쾌하지만 정돈된 느낌"** — 게임 좋아하는 중학생의 에너지 + 깔끔한 카드형 레이아웃으로 전문성.

### 3-2. 색상 (Tailwind 테마에 등록)

| 이름 | 값 | 쓰임 |
|---|---|---|
| `ink` | `#1B2440` | 본문 글자, 제목 (진한 남색 → 전문성) |
| `primary` | `#2F6BFF` | 주요 버튼, 링크, 섹션 포인트 (밝은 파랑) |
| `coral` | `#FF5A5F` | 강조 배지, 수상 아이콘 (활기) |
| `sunny` | `#FFC93C` | 하이라이트, 키워드 칩 배경 일부 (밝음) |
| `mint` | `#2EC4B6` | 자격증 섹션 포인트 |
| `bg` | `#F7F9FF` | 페이지 배경 (아주 연한 파랑빛 흰색) |
| `card` | `#FFFFFF` | 카드 배경 |
| `line` | `#E3E8F5` | 테두리 |

- 원색을 넓은 면적에 쓰지 말고, **배경은 밝고 차분하게 + 포인트로만 원색** 사용.
- 다크 모드는 필수 아님 (선택 사항, Phase 6).

### 3-3. 글꼴 · 모양
- 글꼴: Pretendard. 제목 700~800, 본문 400~500.
- 카드: 둥근 모서리 `rounded-2xl`, 얇은 테두리 + 아주 약한 그림자.
- 게임 느낌 포인트(과하지 않게):
  - 섹션 제목 옆에 작은 아이콘 (`Trophy`, `BadgeCheck`, `Gamepad2`)
  - 카드에 마우스 올리면 살짝 떠오르는 효과 (`hover:-translate-y-1`)
  - 첫 화면 배경에 동글동글한 도형(원, 둥근 사각형)을 흐릿하게 배치
- ⚠️ **포트폴리오 화면 디자인(배경·아이콘·장식)에는 닌텐도 로고, 마리오·포켓몬 등 캐릭터 이미지를 사용하지 않기** (저작권). 대신 일반 게임패드 아이콘 사용.
  - 예외: 내가 만든 포켓몬 도감(`/projects/pokedex.html`)은 PokéAPI에서 이미지를 불러오는 **비공식 팬 프로젝트**로, 페이지 아래에 권리 안내 문구가 들어 있다. 포트폴리오 작품 카드의 썸네일은 캐릭터 그림 대신 **도감 화면을 직접 찍은 캡처**나 아이콘을 쓴다.

### 3-4. 휴대폰 대응 (모바일 우선)
- 기본 레이아웃은 휴대폰(360~430px) 기준으로 먼저 만들고 `md:` `lg:`로 넓힌다.
- 카드 목록: 휴대폰 1열 → 태블릿 2열 → PC 3열.
- 버튼·터치 영역 최소 44×44px.
- 가로 스크롤 생기지 않게 (좌우 여백 16px).
- 글자 크기: 본문 최소 16px (아이폰 입력창 자동 확대 방지).
- 상단 메뉴: 휴대폰에서는 섹션으로 이동하는 가로 탭 or 햄버거 메뉴.

---

## 4. 화면 구성

### 4-1. 보는 사람용 화면 `/`
위에서 아래로:

1. **상단 바** — 이름(닉네임) + 섹션 바로가기(수상 · 자격증 · 관심사 · 작품). 편집 버튼은 **보이지 않게** 한다.
2. **첫 화면 (Hero)**
   - 프로필 사진(둥근 원형, 없으면 이니셜 원 또는 게임패드 아이콘)
   - **한 줄 소개 문구** (크게)
   - 키워드 칩들 (예: `#남학생`)
3. **수상 경력** — 카드 목록 (사진, 대회명, 상 이름, 주최, 날짜, 짧은 설명). 최신순.
4. **자격증 보유 리스트** — 카드 또는 표 형태 (자격증명, 발급 기관, 취득일, 사진 선택)
5. **관심사** — 카드 (이모지/아이콘, 제목, 설명, 사진 선택)
6. **내가 만든 작품** — 카드 (썸네일, 작품 이름, 한 줄 설명, 사용한 기술 태그, `열어보기 ↗` 버튼)
   - 첫 카드: **미니 도감** (포켓몬 도감) → 버튼을 누르면 `/projects/pokedex.html`이 **새 탭**으로 열린다.
   - 아이콘: `Code2` 또는 `Sparkles` (lucide-react)
7. **푸터** — "© 2026 이름" 정도만.

- 섹션에 항목이 0개면: 보는 사람 화면에서는 해당 섹션을 **숨긴다**.

### 4-2. 로그인 `/login`
- 이메일 + 비밀번호 입력.
- 회원가입 버튼 **없음** (주인 계정 하나만 존재).
- 로그인 성공 → `/edit`으로 이동.
- 주인은 주소창에 직접 `/login`을 입력해서 들어간다 (사이트 어디에도 링크 노출 X).

### 4-3. 편집 화면 `/edit` (로그인한 주인만)
- **보는 화면과 똑같은 모양** 위에 편집 도구가 얹힌 형태 (보면서 바로 고치는 느낌).
- 화면 맨 위에 고정된 **편집 모드 띠**: `✏️ 편집 모드` · `[보기 화면으로]` · `[로그아웃]`
- 편집 도구:
  - 글자 부분 클릭 → 입력창으로 바뀜 → `저장` / `취소`
  - 각 섹션 아래 `+ 추가` 버튼 → 새 카드 생성 (안내 문구가 채워진 상태로)
  - 각 카드 오른쪽 위 `🗑 삭제` 버튼 → "정말 삭제할까요?" 확인창 → 삭제
  - 사진 영역 탭 → `사진 올리기` / `사진 바꾸기` / `사진 지우기`
  - 키워드: 칩 옆 `×`로 삭제, `+ 키워드` 로 추가
  - 작품 카드: 이름·설명·태그·링크 주소 수정, 썸네일 사진 올리기/바꾸기, 추가/삭제
  - (선택) 카드 순서 위/아래 이동 버튼
- 저장 성공/실패 시 작은 알림(토스트) 표시.
- 로그인 안 한 사람이 `/edit`에 오면 → `/login`으로 보낸다 (middleware).

---

## 5. 처음에 들어갈 내용 (Seed 데이터)

### 5-1. 실제 내용 (주인이 정해줌)
- **한 줄 소개:** `나는 그냥 사람이야 난 게임을 좋아해 특히 닌텐도 게임을 좋아해`
- **키워드:** `남학생`
- **이름:** 비워 두고 안내 문구 → `여기에 이름이나 닉네임을 적어요`

### 5-2. 안내 문구 (각 섹션에 예시 카드 1개씩, `is_sample = true`)
예시 카드는 편집 모드에서 **"예시"** 배지를 달아 보여주고, 한 번이라도 저장하면 `is_sample = false`로 바꾼다.

**수상 경력 예시 카드**
| 칸 | 안내 문구 |
|---|---|
| 대회/행사 이름 | 대회나 행사 이름을 적어요 (예: ○○시 학생 코딩 대회) |
| 상 이름 | 받은 상을 적어요 (예: 금상, 우수상, 2등) |
| 주최 기관 | 상을 준 곳을 적어요 (예: ○○교육청, ○○학교) |
| 날짜 | 상 받은 날짜를 골라요 |
| 설명 | 어떤 활동을 했고 무엇을 배웠는지 1~2문장으로 적어요 |
| 사진 | 상장이나 활동 사진을 올려요 (개인정보는 가리고!) |

**자격증 예시 카드**
| 칸 | 안내 문구 |
|---|---|
| 자격증 이름 | 자격증 이름을 적어요 (예: 컴퓨터활용능력 2급, 한국사능력검정 3급) |
| 발급 기관 | 자격증을 준 곳을 적어요 (예: 대한상공회의소) |
| 취득일 | 합격한 날짜를 골라요 |
| 메모 | 준비하면서 느낀 점이나 점수를 적어도 좋아요 (선택) |
| 사진 | 자격증 사진을 올려요 (자격증 번호·생년월일은 가리기!) |

**관심사 예시 카드**
| 칸 | 안내 문구 |
|---|---|
| 아이콘 | 관심사를 나타내는 이모지를 골라요 (예: 🎮 📚 ⚽ 💻) |
| 제목 | 관심 있는 것을 짧게 적어요 (예: 닌텐도 게임, 코딩, 축구) |
| 설명 | 왜 좋아하는지, 요즘 무엇을 하고 있는지 적어요 |
| 사진 | 관련 사진을 올려요 (선택) |

**내가 만든 작품 — 실제 내용 1개 (`is_sample = false`)**
| 칸 | 값 |
|---|---|
| 이름 | 미니 도감 |
| 한 줄 설명 | 포켓몬 이름을 검색하면 종족치·상성·기술·특성 등 보고 싶은 정보만 골라 볼 수 있는 도감이에요 |
| 태그 | `HTML`, `CSS`, `JavaScript`, `PokéAPI` |
| 링크 | `/projects/pokedex.html` |
| 썸네일 | 비워 둠 (나중에 도감 화면을 캡처해서 올리기) → 없을 때는 연한 배경 + `Code2` 아이콘 |

**내가 만든 작품 — 새 카드를 추가했을 때 안내 문구**
| 칸 | 안내 문구 |
|---|---|
| 이름 | 작품 이름을 적어요 (예: 미니 도감, 타자 연습 게임) |
| 한 줄 설명 | 무엇을 하는 작품인지 한 문장으로 적어요 |
| 태그 | 사용한 기술이나 도구를 적어요 (예: HTML, 스크래치, 파이썬) |
| 링크 | 작품 주소를 적어요 (예: /projects/파일이름.html 또는 https://...) |
| 썸네일 | 작품 화면을 캡처해서 올려요 |

- 입력창의 `placeholder`에도 같은 안내 문구를 넣는다 (내용을 지웠을 때도 무엇을 써야 하는지 보이도록).

---

## 6. 데이터 구조 (Supabase)

`supabase/schema.sql` 파일로 만들고, 주인이 Supabase SQL Editor에 붙여넣어 실행할 수 있게 한다.

### 6-1. 테이블

```sql
-- 관리자(주인) 목록: 여기 등록된 사용자만 수정 가능
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 프로필 (딱 1줄만 존재)
create table profile (
  id int primary key default 1 check (id = 1),
  name text default '',
  tagline text default '',
  keywords text[] default '{}',
  avatar_url text,
  avatar_path text,          -- Storage 안의 파일 경로 (교체/삭제용)
  updated_at timestamptz default now()
);

create table awards (
  id uuid primary key default gen_random_uuid(),
  title text default '',      -- 대회/행사 이름
  prize text default '',      -- 상 이름
  organizer text default '',  -- 주최
  awarded_on date,
  description text default '',
  image_url text,
  image_path text,
  sort_order int default 0,
  is_sample boolean default false,
  created_at timestamptz default now()
);

create table certificates (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  issuer text default '',
  acquired_on date,
  memo text default '',
  image_url text,
  image_path text,
  sort_order int default 0,
  is_sample boolean default false,
  created_at timestamptz default now()
);

create table interests (
  id uuid primary key default gen_random_uuid(),
  emoji text default '🎮',
  title text default '',
  description text default '',
  image_url text,
  image_path text,
  sort_order int default 0,
  is_sample boolean default false,
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  summary text default '',
  tags text[] default '{}',
  link_url text default '',   -- 사이트 안 주소(/projects/...) 또는 https:// 주소만 허용
  image_url text,
  image_path text,
  sort_order int default 0,
  is_sample boolean default false,
  created_at timestamptz default now()
);
```

### 6-2. 권한 (RLS — "편집은 나만"을 진짜로 지켜주는 부분)
- 모든 테이블 `enable row level security`.
- **읽기(select):** 누구나 가능 (`using (true)`). 단 `admins` 테이블은 읽기도 관리자만.
- **추가/수정/삭제:** `exists (select 1 from admins where user_id = auth.uid())` 일 때만.
- 화면에서 버튼을 숨기는 것만으로는 부족하고, **이 RLS 정책이 실제 보안**이다.

### 6-3. 사진 저장소 (Storage)
- 버킷 이름: `portfolio-images`, **public 읽기**.
- 업로드/삭제 정책: 관리자만 (위와 같은 조건).
- 파일 경로 규칙: `{섹션}/{항목id}/{타임스탬프}.webp` (예: `awards/abc.../1729061234.webp`)

### 6-4. Seed SQL
- `profile`에 5-1의 실제 내용 1줄 insert.
- `awards`, `certificates`, `interests`에 5-2의 예시 카드 1개씩 insert (`is_sample = true`).
- `projects`에 **미니 도감** 1개 insert (`is_sample = false`, 5-2 표의 값 그대로).
  - 예시 카드의 글자 칸에는 안내 문구를 그대로 값으로 넣는다.

---

## 7. 사진 업로드 규칙
- 허용 형식: jpg, jpeg, png, webp, heic(가능하면). 그 외는 "사진 파일만 올릴 수 있어요" 안내.
- 업로드 전 브라우저에서 자동 압축: 긴 변 최대 1600px, 약 500KB 이하, **webp로 변환**.
  - 변환 과정에서 사진 속 위치 정보(EXIF/GPS)가 지워지도록 한다 (개인정보 보호).
- **교체** 시: 새 사진 업로드 성공 → DB 주소 변경 → 예전 파일 Storage에서 삭제.
- **삭제** 시: Storage 파일 삭제 + DB의 `image_url`, `image_path`를 null로.
- 카드 삭제 시: 그 카드의 사진 파일도 함께 삭제.
- 업로드 중에는 진행 표시(스피너) + 버튼 비활성화.
- 화면 표시: `next/image` 사용, 카드 사진은 `aspect-[4/3]` + `object-cover`.

---

## 8. 폴더 구조 (권장)

```
/app
  layout.tsx            # 폰트, 공통 메타데이터
  page.tsx              # 보는 사람용 화면 (서버에서 데이터 읽기)
  login/page.tsx
  edit/page.tsx         # 편집 화면
/components
  Hero.tsx
  SectionHeader.tsx
  AwardCard.tsx
  CertificateCard.tsx
  InterestCard.tsx
  ProjectCard.tsx
  edit/
    EditBar.tsx         # 상단 편집 모드 띠
    InlineText.tsx      # 클릭하면 입력창으로 바뀌는 글자
    ImageUploader.tsx
    ConfirmDialog.tsx
    KeywordEditor.tsx
    Toast.tsx
/lib
  supabase/client.ts    # 브라우저용
  supabase/server.ts    # 서버용 (@supabase/ssr)
  types.ts
  images.ts             # 압축·업로드·삭제 함수
middleware.ts           # /edit 보호
/supabase
  schema.sql            # 테이블 + RLS + Storage 정책 + seed
.env.local.example
README.md               # 설정 방법 (아래 10번 내용)
/public
  projects/
    pokedex.html        # 내가 만든 포켓몬 도감 (이미 완성된 파일, 그대로 사용)
```

- `public/projects/` 안의 파일은 Next.js가 **그대로** 공개 주소로 보여준다 (예: `https://내사이트/projects/pokedex.html`). 로그인 없이 누구나 볼 수 있다.
- ⚠️ Claude Code는 `pokedex.html`의 기능 코드를 **바꾸지 않는다** (주인이 직접 만든 작품). 문제가 있으면 고치기 전에 먼저 알려준다.
- 링크 안전: `link_url`은 `/`로 시작하거나 `https://`로 시작하는 주소만 저장되게 검사한다 (`javascript:` 같은 주소 차단). 바깥 주소는 `target="_blank" rel="noopener noreferrer"`로 연다.

- 보는 화면 카드와 편집 화면 카드는 **같은 컴포넌트**를 쓰고 `editable` prop으로 편집 도구를 켜고 끈다.
- 보는 화면 `/`은 항상 최신 내용이 보이도록 `dynamic = 'force-dynamic'` (또는 수정 후 `revalidatePath('/')`).

---

## 9. 개발 단계 (Claude Code는 이 순서로 진행)

### Phase 0 — 프로젝트 만들기
- Next.js + TypeScript + Tailwind 프로젝트 생성, 필요한 패키지 설치.
- Tailwind 테마에 3-2 색상 등록, Pretendard 폰트 적용.
- `.env.local.example` 작성 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- ✅ 확인: `npm run dev` 실행 시 빈 페이지가 뜬다.

### Phase 1 — 데이터베이스 설계
- `supabase/schema.sql` 작성 (6번 전체 + seed).
- `lib/types.ts`에 타입 정의, Supabase 클라이언트 파일 작성.
- ✅ 확인: SQL 실행 후 Supabase 화면에서 테이블 5개(profile, awards, certificates, interests, projects) + 예시 데이터가 보인다.

### Phase 2 — 디자인 기본 틀
- 공통 레이아웃, 상단 바, 섹션 제목 컴포넌트, 카드 기본 스타일.
- 첫 화면(Hero) 배경 도형 장식.
- ✅ 확인: 휴대폰 크기(개발자도구 375px)에서 깨지지 않는다.

### Phase 3 — 보는 사람용 화면
- DB에서 프로필/수상/자격증/관심사를 읽어서 표시.
- 수상·자격증은 날짜 최신순, 관심사·작품은 `sort_order` 순.
- 작품 카드의 `열어보기` 버튼 → 새 탭에서 작품 페이지 열기.
- 항목이 없는 섹션은 숨김.
- ✅ 확인: 한 줄 소개 + `#남학생` 키워드 + 예시 카드들 + 미니 도감 작품 카드가 보이고, 누르면 도감이 열린다.

### Phase 4 — 로그인과 편집 화면 보호
- `/login` 페이지 (이메일·비밀번호, 에러 메시지 한국어로).
- `middleware.ts`로 로그인 안 한 사용자의 `/edit` 접근 차단.
- 로그인했지만 `admins`에 없는 사용자도 `/edit` 차단.
- ✅ 확인: 로그아웃 상태로 `/edit` 접속 → `/login`으로 이동한다.

### Phase 5 — 편집 기능
- 5-1. 프로필: 이름, 한 줄 소개, 키워드 추가/삭제, 프로필 사진 업로드/교체/삭제.
- 5-2. 글 수정: `InlineText` (한 줄/여러 줄 모두 지원, Enter 저장 · Esc 취소, 여러 줄은 저장 버튼).
- 5-3. 항목 추가: 섹션별 `+ 추가` → 안내 문구가 채워진 새 카드가 맨 위에 생김.
- 5-4. 항목 삭제: 확인창 → 카드와 사진 함께 삭제.
- 5-5. 사진: 7번 규칙대로 업로드·교체·삭제.
- 5-6. 작품: 카드 추가/삭제, 이름·설명·태그·링크 수정, 썸네일 업로드/교체.
- 5-7. (선택) 카드 순서 위/아래 이동.
- 저장 후 토스트 알림, 실패 시 "저장에 실패했어요. 인터넷 연결을 확인해 주세요."
- ✅ 확인: 편집 화면에서 고친 내용이 보는 화면 `/`에 바로 반영된다.

### Phase 6 — 마무리 다듬기
- 로딩 중 표시(스켈레톤), 빈 상태 문구, 에러 처리.
- 접근성: 사진 `alt` 문구, 버튼 `aria-label`, 키보드로도 조작 가능.
- 메타데이터: 사이트 제목, 설명, 공유 미리보기(og 이미지는 단색 배경 + 이름 정도).
- (선택) 다크 모드, 스크롤 시 카드가 부드럽게 나타나는 효과.
- `README.md`에 10번 설정 방법 정리.
- ✅ 확인: 아래 11번 체크리스트 통과.

### Phase 7 — 배포
- GitHub에 올리고 Vercel에 연결, 환경변수 입력.
- Supabase Auth의 Site URL을 배포 주소로 변경.
- ✅ 확인: 휴대폰으로 배포 주소에 접속해서 잘 보인다.

---

## 10. 주인(나)이 직접 해야 하는 설정

> ⚠️ Supabase, Vercel, GitHub 가입은 서비스마다 나이 제한이 있을 수 있어요.
> **부모님이나 보호자와 함께** 가입하고 설정하는 걸 추천해요.

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 만들기.
2. SQL Editor에 `supabase/schema.sql` 붙여넣고 실행.
3. **Authentication → Providers → Email** 에서 **"Allow new users to sign up" 끄기** (아무나 가입 못 하게).
4. **Authentication → Users → Add user** 로 내 계정(이메일+비밀번호) 직접 만들기.
5. 만든 계정의 User UID를 복사해서 SQL Editor에서 실행:
   `insert into admins (user_id) values ('복사한-UID');`
6. **Project Settings → API** 에서 URL과 anon key를 복사해 `.env.local`에 붙여넣기.
   - `service_role` 키는 **절대** 코드나 GitHub에 넣지 않기.
7. `npm run dev` → `http://localhost:3000/login` 에서 로그인해 보기.

---

## 11. 완성 체크리스트

- [ ] 첫 화면에 한 줄 소개 "나는 그냥 사람이야 난 게임을 좋아해 특히 닌텐도 게임을 좋아해"와 `#남학생` 키워드가 보인다
- [ ] 수상 경력 / 자격증 / 관심사 / 내가 만든 작품 섹션이 있다
- [ ] 미니 도감 카드를 누르면 `/projects/pokedex.html`이 새 탭으로 열리고, 로그인 없이 검색이 된다
- [ ] 도감 페이지 맨 위 `← 포트폴리오로 돌아가기`를 누르면 첫 화면으로 돌아온다
- [ ] 처음에는 각 칸에 "무엇을 쓰면 되는지" 안내 문구가 들어 있다
- [ ] 휴대폰(375px)과 PC 모두에서 깔끔하게 보인다
- [ ] 보는 화면에는 편집 버튼이 전혀 안 보인다
- [ ] 로그인하지 않으면 `/edit`에 들어갈 수 없다
- [ ] 로그인하지 않은 상태에서 개발자도구로 직접 DB 수정을 시도해도 거부된다 (RLS)
- [ ] 편집 화면에서 글 수정 → 보는 화면에 반영된다
- [ ] 항목 추가·삭제가 된다
- [ ] 사진 올리기·바꾸기·지우기가 되고, 바꾼 뒤 예전 사진 파일이 남지 않는다
- [ ] 포트폴리오 화면 디자인에 닌텐도 로고·캐릭터 이미지를 사용하지 않았다 (도감 작품 페이지는 팬 프로젝트 안내 문구 포함)

---

## 12. 개인정보 안전 수칙 (사이트에 올리기 전에 꼭!)

포트폴리오는 누구나 볼 수 있는 공개 사이트예요. 아래 정보는 올리지 않거나 가리는 게 좋아요.

- 집 주소, 전화번호, 개인 이메일
- 학교 이름 + 학년 + 반 (조합되면 나를 쉽게 찾을 수 있어요)
- 상장·자격증 사진 속 **생년월일, 자격증 번호, 주민번호 일부** → 사진 올리기 전에 가리기
- 교복 명찰이 보이는 사진, 집 근처가 드러나는 사진
- 실명 대신 **닉네임**을 써도 괜찮아요
