import { NextRequest, NextResponse } from "next/server";
import { analyzePhoto, Tone } from "@/lib/anthropic";

export const runtime = "nodejs";

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_BASE64_LENGTH = 7_000_000; // ~5MB 원본 이미지 기준

export async function POST(request: NextRequest) {
  let body: { image?: string; mediaType?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const { image, mediaType, tone } = body;

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "이미지가 없습니다." }, { status: 400 });
  }
  if (!mediaType || !ALLOWED_MEDIA_TYPES.includes(mediaType)) {
    return NextResponse.json(
      { error: "지원하지 않는 이미지 형식입니다. (jpeg/png/gif/webp만 가능)" },
      { status: 400 }
    );
  }
  if (image.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "이미지 용량이 너무 큽니다. (5MB 이하)" }, { status: 400 });
  }
  if (tone !== "fun" && tone !== "traditional") {
    return NextResponse.json({ error: "잘못된 톤 값입니다." }, { status: 400 });
  }

  try {
    const result = await analyzePhoto(image, mediaType, tone as Tone);
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    console.error("analyze error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
