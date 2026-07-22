"use client";

import { useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import ToneSelector from "@/components/ToneSelector";
import ResultView from "@/components/ResultView";
import ActorMatchResult from "@/components/ActorMatchResult";
import { Tone } from "@/lib/anthropic";
import { resizeImageFile, ResizedImage } from "@/lib/resizeImage";

type ActorPhoto = { imageUrl: string; pageUrl: string; title: string };
type ActorMatch = { actorName: string; reason: string; photo: ActorPhoto | null };

export default function Home() {
  const [resized, setResized] = useState<ResizedImage | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [tone, setTone] = useState<Tone>("fun");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [actorLoading, setActorLoading] = useState(false);
  const [actorError, setActorError] = useState<string | null>(null);
  const [actorMatch, setActorMatch] = useState<ActorMatch | null>(null);

  async function handleFileSelected(file: File) {
    setError(null);
    setResult(null);
    setActorError(null);
    setActorMatch(null);
    setResized(null);
    setProcessingImage(true);
    try {
      const image = await resizeImageFile(file);
      setResized(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 처리할 수 없습니다.");
    } finally {
      setProcessingImage(false);
    }
  }

  function handleFileRejected(message: string) {
    setResized(null);
    setResult(null);
    setActorError(null);
    setActorMatch(null);
    setError(message);
  }

  async function handleSubmit() {
    if (!resized) {
      setError("먼저 사진을 업로드해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: resized.base64, mediaType: resized.mediaType, tone }),
      });
      let data: { result?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("서버 응답을 처리할 수 없습니다. 다른 사진으로 다시 시도해주세요.");
      }
      if (!res.ok) {
        throw new Error(data.error ?? "요청 처리 중 오류가 발생했습니다.");
      }
      setResult(data.result ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMatchActor() {
    if (!resized) {
      setActorError("먼저 사진을 업로드해주세요.");
      return;
    }
    setActorLoading(true);
    setActorError(null);
    setActorMatch(null);

    try {
      const res = await fetch("/api/match-actor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: resized.base64, mediaType: resized.mediaType }),
      });
      let data: { actorName?: string; reason?: string; photo?: ActorPhoto | null; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("서버 응답을 처리할 수 없습니다. 다른 사진으로 다시 시도해주세요.");
      }
      if (!res.ok) {
        throw new Error(data.error ?? "요청 처리 중 오류가 발생했습니다.");
      }
      setActorMatch({
        actorName: data.actorName ?? "",
        reason: data.reason ?? "",
        photo: data.photo ?? null,
      });
    } catch (err) {
      setActorError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setActorLoading(false);
    }
  }

  return (
    <main>
      <div className="header">
        <h1>관상은 과학이다</h1>
        <p>사진을 업로드하면 Claude가 관상을 풀이해드립니다 (오락 목적)</p>
      </div>

      <PhotoUploader
        previewUrl={resized?.previewUrl ?? null}
        processing={processingImage}
        onFileSelected={handleFileSelected}
        onRejected={handleFileRejected}
      />

      <ToneSelector value={tone} onChange={setTone} />

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading || processingImage || !resized}
      >
        {loading ? "풀이 중..." : "관상 보기"}
      </button>

      {error && <p className="error">{error}</p>}
      {result && <ResultView result={result} />}

      {actorError && <p className="error">{actorError}</p>}
      {actorMatch && (
        <ActorMatchResult
          actorName={actorMatch.actorName}
          reason={actorMatch.reason}
          photo={actorMatch.photo}
        />
      )}

      <button
        className="submit-btn submit-btn--secondary"
        onClick={handleMatchActor}
        disabled={actorLoading || processingImage || !resized}
      >
        {actorLoading ? "찾는 중..." : "어울리는 배우자 이미지 찾기"}
      </button>
    </main>
  );
}
