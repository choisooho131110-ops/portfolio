-- =====================================================================
-- 개인 포트폴리오 — Supabase 설정 SQL
-- 사용법: Supabase → SQL Editor → 이 파일 전체를 붙여넣고 [Run]
--   · 여러 번 실행해도 괜찮아요. (이미 있는 건 건너뛰고, 예시 데이터도 중복으로 안 들어가요)
--   · 맨 아래 "관리자 등록" 부분은 계정을 만든 뒤 따로 실행해요.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. 테이블
-- ---------------------------------------------------------------------

-- 관리자(주인) 목록: 여기 등록된 사용자만 수정 가능
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 프로필 (딱 1줄만 존재)
create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  tagline text not null default '',
  keywords text[] not null default '{}',
  avatar_url text,
  avatar_path text,          -- Storage 안의 파일 경로 (교체/삭제용)
  updated_at timestamptz not null default now()
);

-- 수상 경력
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',      -- 대회/행사 이름
  prize text not null default '',      -- 상 이름
  organizer text not null default '',  -- 주최
  awarded_on date,
  description text not null default '',
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

-- 자격증
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  issuer text not null default '',
  acquired_on date,
  memo text not null default '',
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

-- 관심사
create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  emoji text not null default '🎮',
  title text not null default '',
  description text not null default '',
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

-- 내가 만든 작품
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  summary text not null default '',
  tags text[] not null default '{}',
  -- 사이트 안 주소(/projects/...) 또는 https:// 주소만 허용 (javascript: 같은 위험한 주소 차단)
  link_url text not null default ''
    check (link_url = '' or link_url ~ '^/[^/\\]' or link_url ~ '^https://'),
  image_url text,
  image_path text,
  sort_order int not null default 0,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

-- 프로필을 고치면 updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_touch_updated_at on public.profile;
create trigger profile_touch_updated_at
  before update on public.profile
  for each row execute function public.touch_updated_at();


-- ---------------------------------------------------------------------
-- 2. 관리자 확인 함수
--    "지금 로그인한 사람이 admins에 있나?"를 한 곳에서 검사해요.
--    security definer: admins 테이블의 읽기 제한과 상관없이 검사할 수 있게 함.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;


-- ---------------------------------------------------------------------
-- 3. 권한 (RLS) — "편집은 나만"을 진짜로 지켜주는 부분
--    화면에서 버튼을 숨기는 건 겉모습일 뿐, 실제 보안은 여기서 해요.
-- ---------------------------------------------------------------------
alter table public.admins       enable row level security;
alter table public.profile      enable row level security;
alter table public.awards       enable row level security;
alter table public.certificates enable row level security;
alter table public.interests    enable row level security;
alter table public.projects     enable row level security;

-- API에서 테이블에 접근할 수 있는 기본 권한 (실제 허용 여부는 아래 RLS 정책이 결정)
grant select on public.profile, public.awards, public.certificates, public.interests, public.projects
  to anon, authenticated;
grant insert, update, delete on public.profile, public.awards, public.certificates, public.interests, public.projects
  to authenticated;
grant select on public.admins to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- admins: 읽기도 관리자만
drop policy if exists "admins_select_admin" on public.admins;
create policy "admins_select_admin" on public.admins
  for select to authenticated
  using (public.is_admin());

-- 나머지 5개 테이블: 읽기는 누구나, 추가/수정/삭제는 관리자만
do $$
declare
  t text;
begin
  foreach t in array array['profile', 'awards', 'certificates', 'interests', 'projects'] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_all', t);
    execute format('drop policy if exists %I on public.%I', t || '_insert_admin', t);
    execute format('drop policy if exists %I on public.%I', t || '_update_admin', t);
    execute format('drop policy if exists %I on public.%I', t || '_delete_admin', t);

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_select_all', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      t || '_insert_admin', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_update_admin', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      t || '_delete_admin', t);
  end loop;
end;
$$;


-- ---------------------------------------------------------------------
-- 4. 사진 저장소 (Storage)
--    버킷: portfolio-images (누구나 사진 보기 가능)
--    경로 규칙: {섹션}/{항목id}/{타임스탬프}.webp
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  2097152,  -- 2MB (압축 후 약 500KB라 넉넉함)
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 공개 버킷이라 사진 주소로 보기는 누구나 가능.
-- 아래 select 정책은 "파일 목록 조회/삭제"용이라 관리자만 허용해요.
drop policy if exists "portfolio_images_select_admin" on storage.objects;
create policy "portfolio_images_select_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "portfolio_images_insert_admin" on storage.objects;
create policy "portfolio_images_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "portfolio_images_update_admin" on storage.objects;
create policy "portfolio_images_update_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin())
  with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "portfolio_images_delete_admin" on storage.objects;
create policy "portfolio_images_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin());


-- ---------------------------------------------------------------------
-- 5. 처음 내용 (Seed)
-- ---------------------------------------------------------------------

-- 프로필: 주인이 정해 준 실제 내용 (이미 있으면 건드리지 않음)
insert into public.profile (id, name, tagline, keywords)
values (
  1,
  '',
  '나는 그냥 사람이야 난 게임을 좋아해 특히 닌텐도 게임을 좋아해',
  array['남학생']
)
on conflict (id) do nothing;

-- 예시 카드: 테이블이 비어 있을 때만 1개씩 넣어요
insert into public.awards (title, prize, organizer, description, is_sample)
select
  '대회나 행사 이름을 적어요 (예: ○○시 학생 코딩 대회)',
  '받은 상을 적어요 (예: 금상, 우수상, 2등)',
  '상을 준 곳을 적어요 (예: ○○교육청, ○○학교)',
  '어떤 활동을 했고 무엇을 배웠는지 1~2문장으로 적어요',
  true
where not exists (select 1 from public.awards);

insert into public.certificates (name, issuer, memo, is_sample)
select
  '자격증 이름을 적어요 (예: 컴퓨터활용능력 2급, 한국사능력검정 3급)',
  '자격증을 준 곳을 적어요 (예: 대한상공회의소)',
  '준비하면서 느낀 점이나 점수를 적어도 좋아요 (선택)',
  true
where not exists (select 1 from public.certificates);

insert into public.interests (emoji, title, description, is_sample)
select
  '🎮',
  '관심 있는 것을 짧게 적어요 (예: 닌텐도 게임, 코딩, 축구)',
  '왜 좋아하는지, 요즘 무엇을 하고 있는지 적어요',
  true
where not exists (select 1 from public.interests);

-- 작품: 실제 내용 (미니 도감)
insert into public.projects (title, summary, tags, link_url, is_sample)
select
  '미니 도감',
  '포켓몬 이름을 검색하면 종족치·상성·기술·특성 등 보고 싶은 정보만 골라 볼 수 있는 도감이에요',
  array['HTML', 'CSS', 'JavaScript', 'PokéAPI'],
  '/projects/pokedex.html',
  false
where not exists (select 1 from public.projects);


-- =====================================================================
-- 6. 관리자 등록 (계정을 만든 뒤에 따로 실행!)
--    Authentication → Users → Add user 로 내 계정을 만들고,
--    그 계정의 User UID를 복사해서 아래 줄의 앞 '-- '를 지우고 실행해요.
-- =====================================================================
-- insert into public.admins (user_id) values ('복사한-UID') on conflict do nothing;
