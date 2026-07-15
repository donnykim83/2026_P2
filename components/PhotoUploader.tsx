"use client";

import { useRef, useState } from "react";

type Props = {
  onImageSelected: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
};

export default function PhotoUploader({ onImageSelected, previewUrl }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
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
        {previewUrl ? (
          <img src={previewUrl} alt="업로드한 사진 미리보기" className="uploader__preview" />
        ) : (
          <div className="uploader__placeholder">
            <p>사진을 선택해주세요</p>
            <span>JPG, PNG, WEBP · 최대 5MB</span>
          </div>
        )}
      </div>

      <div className="uploader__actions">
        <button
          type="button"
          className="uploader__action-btn"
          onClick={() => cameraInputRef.current?.click()}
        >
          📷 카메라로 촬영
        </button>
        <button
          type="button"
          className="uploader__action-btn"
          onClick={() => galleryInputRef.current?.click()}
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
