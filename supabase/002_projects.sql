-- =====================================================================
-- 추가 설정: "내가 만든 작품" 섹션
-- 이미 schema.sql 을 실행한 프로젝트에서 이 파일만 실행해요.
-- (schema.sql 을 처음 실행하는 경우에는 이미 들어 있어서 필요 없어요)
-- 여러 번 실행해도 괜찮아요.
-- =====================================================================

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

-- 권한: 읽기는 누구나, 추가/수정/삭제는 관리자만
alter table public.projects enable row level security;

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

drop policy if exists "projects_select_all" on public.projects;
drop policy if exists "projects_insert_admin" on public.projects;
drop policy if exists "projects_update_admin" on public.projects;
drop policy if exists "projects_delete_admin" on public.projects;

create policy "projects_select_all" on public.projects
  for select to anon, authenticated using (true);
create policy "projects_insert_admin" on public.projects
  for insert to authenticated with check (public.is_admin());
create policy "projects_update_admin" on public.projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "projects_delete_admin" on public.projects
  for delete to authenticated using (public.is_admin());

-- 처음 내용: 미니 도감 (작품이 하나도 없을 때만)
insert into public.projects (title, summary, tags, link_url, is_sample)
select
  '미니 도감',
  '포켓몬 이름을 검색하면 종족치·상성·기술·특성 등 보고 싶은 정보만 골라 볼 수 있는 도감이에요',
  array['HTML', 'CSS', 'JavaScript', 'PokéAPI'],
  '/projects/pokedex.html',
  false
where not exists (select 1 from public.projects);
