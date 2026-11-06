// 편집 화면에서 카드·프로필에 넘겨주는 "편집 기능" 모음의 모양
// (보는 화면에서는 이게 없어서 편집 도구가 안 보여요)
import type { Award, Certificate, Interest, Profile, Project, SectionTable } from "./types";

export type ProfileEdit = {
  save: (patch: Partial<Profile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
};

export type ItemEdit<T> = {
  save: (patch: Partial<T>) => Promise<boolean>;
  remove: () => Promise<void>;
  uploadImage: (file: File) => Promise<boolean>;
  removeImage: () => Promise<boolean>;
  /** 순서 바꾸기 (관심사·작품만). 맨 위/맨 아래면 undefined */
  moveUp?: () => Promise<void>;
  moveDown?: () => Promise<void>;
};

export type PortfolioEditor = {
  profile: ProfileEdit;
  award: (item: Award) => ItemEdit<Award>;
  certificate: (item: Certificate) => ItemEdit<Certificate>;
  interest: (item: Interest, index: number, total: number) => ItemEdit<Interest>;
  project: (item: Project, index: number, total: number) => ItemEdit<Project>;
  add: (table: SectionTable) => Promise<void>;
};
