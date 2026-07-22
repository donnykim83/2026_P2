const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
// Vercel 서버리스 함수의 요청 본문 한도(~4.5MB)보다 여유 있게 낮춰서,
// 그 한계에 걸려 원시 텍스트 응답이 오기 전에 우리 쪽에서 먼저 JSON 에러로 처리한다.
const MAX_BASE64_LENGTH = 4_000_000; // 약 3MB 원본 이미지 기준

export type ImagePayload = { image: string; mediaType: string };
export type ValidationResult = { data: ImagePayload } | { error: string; status: number };

export function validateImagePayload(body: unknown): ValidationResult {
  const { image, mediaType } = (body ?? {}) as { image?: unknown; mediaType?: unknown };

  if (!image || typeof image !== "string") {
    return { error: "이미지가 없습니다.", status: 400 };
  }
  if (!mediaType || typeof mediaType !== "string" || !ALLOWED_MEDIA_TYPES.includes(mediaType)) {
    return { error: "지원하지 않는 이미지 형식입니다. (jpeg/png/gif/webp만 가능)", status: 400 };
  }
  if (image.length > MAX_BASE64_LENGTH) {
    return { error: "이미지 용량이 너무 큽니다. 다른 사진으로 시도해주세요.", status: 400 };
  }

  return { data: { image, mediaType } };
}
