"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onFileSelected: (file: File) => void;
  onRejected: (message: string) => void;
  previewUrl: string | null;
  processing: boolean;
};

export default function PhotoUploader({ onFileSelected, onRejected, previewUrl, processing }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!zoomOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomOpen]);

  useEffect(() => {
    if (!previewUrl) setZoomOpen(false);
  }, [previewUrl]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    // 일부 안드로이드 갤러리/클라우드 연동 파일 제공자는 file.type을 빈 문자열로 넘겨준다.
    // type이 아예 없는 경우는 통과시키고, 실제 이미지 여부는 리사이즈 단계의 디코딩에서 검증한다.
    // type이 명시적으로 존재하면서 이미지가 아닌 경우(예: video/*, application/pdf)만 여기서 거른다.
    if (file.type && !file.type.startsWith("image/")) {
      onRejected("이미지 파일만 선택할 수 있습니다.");
      return;
    }
    onFileSelected(file);
  }

  return (
    <div>
      <div
        className={`uploader ${isDragging ? "uploader--dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {processing ? (
          <div className="uploader__placeholder">
            <p>사진 처리 중...</p>
          </div>
        ) : previewUrl ? (
          <div className="uploader__preview-wrap">
            <img
              src={previewUrl}
              alt="업로드한 사진 미리보기"
              className="uploader__preview"
              onClick={() => setZoomOpen(true)}
            />
            <span className="uploader__zoom-hint">🔍 눌러서 확대</span>
          </div>
        ) : (
          <div className="uploader__placeholder">
            <p>사진을 선택해주세요</p>
            <span>JPG, PNG, WEBP · 최대 30MB</span>
          </div>
        )}
      </div>

      {zoomOpen && previewUrl && (
        <div className="lightbox" onClick={() => setZoomOpen(false)}>
          <img
            src={previewUrl}
            alt="확대된 업로드 사진"
            className="lightbox__image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setZoomOpen(false)}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}

      <div className="uploader__actions">
        <button
          type="button"
          className="uploader__action-btn"
          onClick={() => cameraInputRef.current?.click()}
          disabled={processing}
        >
          📷 카메라로 촬영
        </button>
        <button
          type="button"
          className="uploader__action-btn"
          onClick={() => galleryInputRef.current?.click()}
          disabled={processing}
        >
          🖼️ 갤러리에서 선택
        </button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
