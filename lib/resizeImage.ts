const MAX_DIMENSION = 1568; // Claude vision의 권장 최대 해상도
const JPEG_QUALITY = 0.85;

export async function resizeImageFile(
  file: File
): Promise<{ base64: string; mediaType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("이미지를 불러올 수 없습니다. 다른 사진으로 시도해주세요."));
    el.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("이미지 처리를 지원하지 않는 브라우저입니다.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const resizedDataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return {
    base64: resizedDataUrl.split(",")[1] ?? "",
    mediaType: "image/jpeg",
  };
}
