"use client";

import { useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PortfolioView } from "@/components/PortfolioView";
import type { PortfolioData } from "@/lib/data";
import type { ItemEdit, PortfolioEditor } from "@/lib/editor";
import { ImageError, makeImagePath, prepareImage, removeImages, uploadImage } from "@/lib/images";
import { isSafeLink } from "@/lib/links";
import { AWARD_GUIDE, CERTIFICATE_GUIDE, INTEREST_GUIDE, PROJECT_GUIDE } from "@/lib/placeholders";
import { sortAwards, sortCertificates, sortInterests, sortProjects } from "@/lib/sort";
import { createClient } from "@/lib/supabase/client";
import type { Award, Certificate, Interest, Profile, Project, SectionTable } from "@/lib/types";
import { useConfirm } from "./ConfirmDialog";
import { Toaster, useToasts } from "./Toast";

type Items = { awards: Award[]; certificates: Certificate[]; interests: Interest[]; projects: Project[] };
type RowOf<K extends SectionTable> = Items[K][number];
/** 순서를 직접 바꿀 수 있는 섹션 (나머지는 날짜순) */
type OrderedTable = "interests" | "projects";

const SORTERS: { [K in SectionTable]: (list: RowOf<K>[]) => RowOf<K>[] } = {
  awards: sortAwards,
  certificates: sortCertificates,
  interests: sortInterests,
  projects: sortProjects,
};

// + 추가 를 누르면 생기는 새 카드: 안내 문구가 채워진 "예시" 상태
const NEW_ITEM: { [K in SectionTable]: Partial<RowOf<K>> } = {
  awards: {
    title: AWARD_GUIDE.title,
    prize: AWARD_GUIDE.prize,
    organizer: AWARD_GUIDE.organizer,
    description: AWARD_GUIDE.description,
    is_sample: true,
  },
  certificates: {
    name: CERTIFICATE_GUIDE.name,
    issuer: CERTIFICATE_GUIDE.issuer,
    memo: CERTIFICATE_GUIDE.memo,
    is_sample: true,
  },
  interests: {
    emoji: "🎮",
    title: INTEREST_GUIDE.title,
    description: INTEREST_GUIDE.description,
    is_sample: true,
  },
  projects: {
    title: PROJECT_GUIDE.title,
    summary: PROJECT_GUIDE.summary,
    tags: [],
    link_url: "",
    is_sample: true,
  },
};

const GUIDE_TITLES = [AWARD_GUIDE.title, CERTIFICATE_GUIDE.name, INTEREST_GUIDE.title, PROJECT_GUIDE.title];

function failMessage(error: unknown): string {
  if (error instanceof ImageError) return error.message;
  const e = (error ?? {}) as { code?: string; status?: number; statusCode?: string };
  // PGRST116: 고친 줄이 0개 = 권한이 없어서 RLS 가 막음 (보통 로그인이 끝났을 때)
  if (e.code === "PGRST116" || e.code === "42501" || e.code === "PGRST301" || e.status === 401 || e.status === 403 || e.statusCode === "403") {
    return "로그인이 끝났거나 권한이 없어요. 다시 로그인해 주세요.";
  }
  return "저장에 실패했어요. 인터넷 연결을 확인해 주세요.";
}

/** 편집 화면: 내용을 들고 있다가, 고치면 Supabase 에 저장하고 화면도 바로 바꿔요 */
export function EditablePortfolio({ initial }: { initial: PortfolioData }) {
  const supabase = useMemo(() => createClient(), []);
  // 네 카드 테이블을 함수 하나로 다루려고 타입 검사를 느슨하게 한 같은 클라이언트
  const db = supabase as unknown as SupabaseClient;

  const [data, setData] = useState(initial);
  const { toasts, show } = useToasts();
  const { confirm, dialog } = useConfirm();

  function fail(error: unknown): false {
    console.error(error);
    show("error", failMessage(error));
    return false;
  }

  function setItems<K extends SectionTable>(table: K, update: (list: RowOf<K>[]) => RowOf<K>[]) {
    setData((d) => ({ ...d, [table]: SORTERS[table](update(d[table] as RowOf<K>[])) }));
  }

  // ───────────── 프로필 ─────────────

  async function saveProfile(patch: Partial<Profile>) {
    const { data: row, error } = await supabase.from("profile").update(patch).eq("id", 1).select().single();
    if (error) return fail(error);
    setData((d) => ({ ...d, profile: row }));
    show("success", "저장했어요");
    return true;
  }

  async function uploadAvatar(file: File) {
    const oldPath = data.profile.avatar_path;
    let newPath: string | null = null;
    try {
      const blob = await prepareImage(file);
      newPath = makeImagePath("profile", 1, blob);
      const url = await uploadImage(supabase, newPath, blob);
      const { data: row, error } = await supabase
        .from("profile")
        .update({ avatar_url: url, avatar_path: newPath })
        .eq("id", 1)
        .select()
        .single();
      if (error) throw error;
      setData((d) => ({ ...d, profile: row }));
      await removeImages(supabase, [oldPath]); // 예전 사진 파일은 지우기
      show("success", oldPath ? "사진을 바꿨어요" : "사진을 올렸어요");
      return true;
    } catch (e) {
      await removeImages(supabase, [newPath]); // 올라갔다면 정리
      return fail(e);
    }
  }

  async function removeAvatar() {
    const ok = await confirm({ title: "프로필 사진을 지울까요?", confirmLabel: "지우기" });
    if (!ok) return false;
    const oldPath = data.profile.avatar_path;
    const { data: row, error } = await supabase
      .from("profile")
      .update({ avatar_url: null, avatar_path: null })
      .eq("id", 1)
      .select()
      .single();
    if (error) return fail(error);
    setData((d) => ({ ...d, profile: row }));
    await removeImages(supabase, [oldPath]);
    show("success", "사진을 지웠어요");
    return true;
  }

  // ───────────── 카드 (수상 · 자격증 · 관심사 · 작품) ─────────────

  async function saveItem<K extends SectionTable>(
    table: K,
    id: string,
    patch: Partial<RowOf<K>>,
    message = "저장했어요",
  ) {
    // 작품 주소는 안전한 것만 (DB에서도 한 번 더 막아요)
    const link = (patch as Partial<Project>).link_url;
    if (link && !isSafeLink(link)) {
      show("error", "주소는 / 또는 https:// 로 시작해야 해요");
      return false;
    }
    // 한 번이라도 저장하면 더 이상 "예시"가 아니에요
    const { data: row, error } = await db
      .from(table)
      .update({ ...patch, is_sample: false })
      .eq("id", id)
      .select()
      .single();
    if (error) return fail(error);
    setItems(table, (list) => list.map((x) => (x.id === id ? (row as RowOf<K>) : x)));
    show("success", message);
    return true;
  }

  async function uploadItemImage<K extends SectionTable>(table: K, item: RowOf<K>, file: File) {
    let newPath: string | null = null;
    try {
      const blob = await prepareImage(file);
      newPath = makeImagePath(table, item.id, blob);
      const url = await uploadImage(supabase, newPath, blob);
      const patch = { image_url: url, image_path: newPath } as Partial<RowOf<K>>;
      const ok = await saveItem(table, item.id, patch, item.image_path ? "사진을 바꿨어요" : "사진을 올렸어요");
      if (!ok) {
        await removeImages(supabase, [newPath]);
        return false;
      }
      await removeImages(supabase, [item.image_path]); // 예전 사진 파일은 지우기
      return true;
    } catch (e) {
      await removeImages(supabase, [newPath]);
      return fail(e);
    }
  }

  async function removeItemImage<K extends SectionTable>(table: K, item: RowOf<K>) {
    const ok = await confirm({ title: "사진을 지울까요?", confirmLabel: "지우기" });
    if (!ok) return false;
    const patch = { image_url: null, image_path: null } as Partial<RowOf<K>>;
    if (!(await saveItem(table, item.id, patch, "사진을 지웠어요"))) return false;
    await removeImages(supabase, [item.image_path]);
    return true;
  }

  async function deleteItem<K extends SectionTable>(table: K, item: RowOf<K>, name: string) {
    const label = GUIDE_TITLES.includes(name) || !name ? "예시" : name.length > 20 ? `${name.slice(0, 20)}…` : name;
    const ok = await confirm({
      title: "정말 삭제할까요?",
      message: `‘${label}’ 카드를 지우면 되돌릴 수 없어요.`,
    });
    if (!ok) return;

    const { data: rows, error } = await db.from(table).delete().eq("id", item.id).select("id");
    if (error || !rows?.length) {
      fail(error ?? { code: "42501" });
      return;
    }
    setItems(table, (list) => list.filter((x) => x.id !== item.id));
    await removeImages(supabase, [item.image_path]); // 카드 사진도 함께 삭제
    show("success", "삭제했어요");
  }

  async function addItem(table: SectionTable) {
    const values: Record<string, unknown> = { ...NEW_ITEM[table] };
    if (table === "interests" || table === "projects") {
      // 맨 위에 오도록 지금 가장 작은 순서보다 1 작게
      values.sort_order = Math.min(0, ...data[table].map((i) => i.sort_order)) - 1;
    }
    const { data: row, error } = await db.from(table).insert(values).select().single();
    if (error) {
      fail(error);
      return;
    }
    setItems(table, (list) => [row, ...list]);
    show("success", "새 카드를 만들었어요. 글자를 눌러서 고쳐 보세요");
  }

  async function reloadItems<K extends SectionTable>(table: K) {
    const { data: rows } = await db.from(table).select("*");
    if (rows) setItems(table, () => rows as RowOf<K>[]);
  }

  async function moveItem<K extends OrderedTable>(table: K, index: number, dir: -1 | 1) {
    const list = [...(data[table] as RowOf<K>[])];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];

    // 0, 1, 2… 로 순서를 다시 매기고 바뀐 것만 저장
    const changed = list.map((it, i) => ({ it, i })).filter(({ it, i }) => it.sort_order !== i);
    const results = await Promise.all(
      changed.map(({ it, i }) => db.from(table).update({ sort_order: i }).eq("id", it.id).select().single()),
    );
    const error = results.find((r) => r.error)?.error;
    if (error) {
      fail(error);
      await reloadItems(table); // 일부만 저장됐을 수 있으니 DB 기준으로 다시 맞추기
      return;
    }
    const updated = new Map(results.map((r) => [(r.data as RowOf<K>).id, r.data as RowOf<K>]));
    setItems(table, (items) => items.map((x) => updated.get(x.id) ?? x));
  }

  /** 순서 버튼: 맨 위 카드는 ↑, 맨 아래 카드는 ↓ 를 끔 */
  const moveButtons = (table: OrderedTable, i: number, total: number) => ({
    moveUp: i > 0 ? () => moveItem(table, i, -1) : undefined,
    moveDown: i < total - 1 ? () => moveItem(table, i, 1) : undefined,
  });

  function itemEdit<K extends SectionTable>(table: K, item: RowOf<K>, name: string): ItemEdit<RowOf<K>> {
    return {
      save: (patch) => saveItem(table, item.id, patch),
      remove: () => deleteItem(table, item, name),
      uploadImage: (file) => uploadItemImage(table, item, file),
      removeImage: () => removeItemImage(table, item),
    };
  }

  const editor: PortfolioEditor = {
    profile: { save: saveProfile, uploadAvatar, removeAvatar },
    award: (item) => itemEdit("awards", item, item.title),
    certificate: (item) => itemEdit("certificates", item, item.name),
    interest: (item, i, total) => ({ ...itemEdit("interests", item, item.title), ...moveButtons("interests", i, total) }),
    project: (item, i, total) => ({ ...itemEdit("projects", item, item.title), ...moveButtons("projects", i, total) }),
    add: addItem,
  };

  return (
    <>
      <PortfolioView data={data} editor={editor} />
      {dialog}
      <Toaster toasts={toasts} />
    </>
  );
}
