"use client";

import { useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import ToneSelector from "@/components/ToneSelector";
import ResultView from "@/components/ResultView";
import { Tone } from "@/lib/anthropic";
import { resizeImageFile } from "@/lib/resizeImage";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("fun");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit() {
    if (!file) {
      setError("먼저 사진을 업로드해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { base64, mediaType } = await resizeImageFile(file);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType, tone }),
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

  return (
    <main>
      <div className="header">
        <h1>관상은 과학이다</h1>
        <p>사진을 업로드하면 Claude가 관상을 풀이해드립니다 (오락 목적)</p>
      </div>

      <PhotoUploader
        previewUrl={previewUrl}
        onImageSelected={(f, url) => {
          setFile(f);
          setPreviewUrl(url);
          setResult(null);
          setError(null);
        }}
      />

      <ToneSelector value={tone} onChange={setTone} />

      <button className="submit-btn" onClick={handleSubmit} disabled={loading || !file}>
        {loading ? "풀이 중..." : "관상 보기"}
      </button>

      {error && <p className="error">{error}</p>}
      {result && <ResultView result={result} />}
    </main>
  );
}
