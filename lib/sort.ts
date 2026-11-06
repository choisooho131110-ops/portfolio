// 화면에서 카드를 고친 뒤 다시 줄 세울 때 사용 (lib/data.ts 의 DB 정렬과 같은 규칙)
import type { Award, Certificate, Interest, Project } from "./types";

/** 날짜 최신순. 날짜가 비어 있는 카드(새 카드)는 맨 위. 같으면 나중에 만든 게 위 */
function byDateDesc(a: string | null, b: string | null, ac: string, bc: string) {
  if (a !== b) {
    if (a === null) return -1;
    if (b === null) return 1;
    return a < b ? 1 : -1;
  }
  return ac < bc ? 1 : ac > bc ? -1 : 0;
}

export const sortAwards = (items: Award[]) =>
  [...items].sort((a, b) => byDateDesc(a.awarded_on, b.awarded_on, a.created_at, b.created_at));

export const sortCertificates = (items: Certificate[]) =>
  [...items].sort((a, b) => byDateDesc(a.acquired_on, b.acquired_on, a.created_at, b.created_at));

/** 관심사·작품: sort_order 작은 게 위. 같으면 나중에 만든 게 위 */
function bySortOrder<T extends { sort_order: number; created_at: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => a.sort_order - b.sort_order || (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0),
  );
}

export const sortInterests = (items: Interest[]) => bySortOrder(items);
export const sortProjects = (items: Project[]) => bySortOrder(items);
