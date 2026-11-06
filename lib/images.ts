// 사진 압축 · 업로드 · 삭제 (브라우저에서 실행)
import type { SupabaseClient } from "@supabase/supabase-js";
import { IMAGE_BUCKET, type Database } from "./types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const ALLOWED_EXT = /\.(jpe?g|png|webp|heic|heif)$/i;
const MAX_ORIGINAL_BYTES = 30 * 1024 * 1024; // 원본 30MB까지

/** 사용자에게 그대로 보여줘도 되는 오류 */
export class ImageError extends Error {}

/**
 * 올리기 전에 브라우저에서 압축:
 * 긴 변 1600px 이하, 약 500KB 이하, webp 로 변환.
 * 새로 그려서 저장하기 때문에 사진 속 위치 정보(EXIF/GPS)도 지워져요.
 */
export async function prepareImage(file: File): Promise<Blob> {
  const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT.test(file.name);
  if (!typeOk) throw new ImageError("사진 파일만 올릴 수 있어요 (jpg, png, webp, heic)");
  if (file.size > MAX_ORIGINAL_BYTES) throw new ImageError("사진이 너무 커요. 30MB보다 작은 사진을 골라 주세요.");

  // 편집 화면에서만 필요하니 그때 불러와요
  const { default: imageCompression } = await import("browser-image-compression");
  const options = {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.5,
    initialQuality: 0.85,
    useWebWorker: true,
    preserveExif: false,
  };

  try {
    const webp = await imageCompression(file, { ...options, fileType: "image/webp" });
    if (webp.type === "image/webp") return webp;
    // 일부 브라우저(사파리 등)는 webp 로 못 만들어요 → jpg 로 다시
    return await imageCompression(file, { ...options, fileType: "image/jpeg" });
  } catch (e) {
    console.error(e);
    throw new ImageError(
      "이 사진을 열 수 없어요. 다른 사진을 고르거나, JPG·PNG로 바꿔서 올려 주세요.",
    );
  }
}

/** 경로 규칙: {섹션}/{항목id}/{타임스탬프}.webp */
export function makeImagePath(folder: string, id: string | number, blob: Blob) {
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return `${folder}/${id}/${Date.now()}.${ext}`;
}

/** 올리고 나서 누구나 볼 수 있는 주소를 돌려줘요 */
export async function uploadImage(
  supabase: SupabaseClient<Database>,
  path: string,
  blob: Blob,
): Promise<string> {
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000", // 파일 이름이 매번 달라서 오래 캐시해도 안전
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** 파일 지우기 (실패해도 화면 동작은 계속되도록 결과만 기록) */
export async function removeImages(supabase: SupabaseClient<Database>, paths: (string | null)[]) {
  const targets = paths.filter((p): p is string => !!p);
  if (targets.length === 0) return;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(targets);
  if (error) console.error("사진 파일 삭제 실패", targets, error);
}
