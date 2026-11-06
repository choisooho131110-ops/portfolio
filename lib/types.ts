// supabase/schema.sql 과 똑같은 모양을 유지해야 해요.
// (테이블을 바꾸면 이 파일도 같이 고치기)

export type Profile = {
  id: 1;
  name: string;
  tagline: string;
  keywords: string[];
  avatar_url: string | null;
  avatar_path: string | null;
  updated_at: string;
};

export type Award = {
  id: string;
  title: string;
  prize: string;
  organizer: string;
  awarded_on: string | null; // 'YYYY-MM-DD'
  description: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_sample: boolean;
  created_at: string;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  acquired_on: string | null; // 'YYYY-MM-DD'
  memo: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_sample: boolean;
  created_at: string;
};

export type Interest = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_sample: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  link_url: string; // '/projects/...' 또는 'https://...' (빈 칸 가능)
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_sample: boolean;
  created_at: string;
};

/** 카드가 있는 섹션 이름 = 테이블 이름 = Storage 경로의 첫 폴더 */
export type SectionTable = "awards" | "certificates" | "interests" | "projects";

/** Storage 버킷 이름 */
export const IMAGE_BUCKET = "portfolio-images";

// ---------------------------------------------------------------------
// Supabase 클라이언트용 DB 타입 (supabase.from('awards') 결과에 타입이 붙도록)
// ---------------------------------------------------------------------

/** 기본값이 있는 칸은 넣을 때 생략 가능 */
type Insertable<T, Required extends keyof T = never> = Pick<T, Required> &
  Partial<Omit<T, Required>>;

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admins: Table<{ user_id: string }, { user_id: string }>;
      profile: Table<Profile, Insertable<Profile>>;
      awards: Table<Award, Insertable<Award>>;
      certificates: Table<Certificate, Insertable<Certificate>>;
      interests: Table<Interest, Insertable<Interest>>;
      projects: Table<Project, Insertable<Project>>;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
