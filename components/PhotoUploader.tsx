"use client";

import { useRef, useState } from "react";

type Props = {
  onImageSelected: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
};

export default function PhotoUploader({ onImageSelected, previewUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  }

  return (
    <div
      className={`uploader ${isDragging ? "uploader--dragging" : ""}`}
      onClick={() => inputRef.current?.click()}
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {previewUrl ? (
        <img src={previewUrl} alt="업로드한 사진 미리보기" className="uploader__preview" />
      ) : (
        <div className="uploader__placeholder">
          <p>사진을 클릭하거나 드래그해서 업로드하세요</p>
          <span>JPG, PNG, WEBP · 최대 5MB</span>
        </div>
      )}
    </div>
  );
}
