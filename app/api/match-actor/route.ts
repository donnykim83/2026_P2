import { NextRequest, NextResponse } from "next/server";
import { matchActor } from "@/lib/anthropic";
import { findActorPhoto } from "@/lib/wikipedia";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { validateImagePayload } from "@/lib/validateImagePayload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const validated = validateImagePayload(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  try {
    const match = await matchActor(validated.data.image, validated.data.mediaType);
    const photo = await findActorPhoto(match.actorName, match.actorNameEn);
    return NextResponse.json({
      actorName: match.actorName,
      reason: match.reason,
      photo,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    console.error("match-actor error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
