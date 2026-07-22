// Claude Vision의 이미지 토큰 비용은 대략 (가로px × 세로px) / 750 으로 계산되어
// 화질보다 해상도가 비용에 훨씬 큰 영향을 준다. 관상 분석에 필요한 얼굴 디테일은
// 유지하면서 토큰 사용량을 낮추기 위해 최대 변 길이를 1024px로 제한한다.
const MAX_DIMENSION = 1024;
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;
// 최종 base64 결과가 대략 1.5MB 이하가 되도록 하는 목표치 (base64는 원본 대비 약 4/3 크기)
const MAX_OUTPUT_BASE64_LENGTH = 2_000_000;
// 원본 파일 자체가 비정상적으로 큰 경우(수십 MB급 사진 등) 디코딩을 시도하기 전에 걸러낸다.
const MAX_INPUT_BYTES = 30 * 1024 * 1024;
const HEIC_PATTERN = /\.(heic|heif)$/i;

function looksLikeHeic(file: File): boolean {
  return (
    HEIC_PATTERN.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

export type ResizedImage = {
  base64: string;
  mediaType: "image/jpeg";
  previewUrl: string;
};

type ImageSource = {
  image: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

export async function resizeImageFile(file: File): Promise<ResizedImage> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("파일 용량이 너무 큽니다. 30MB 이하의 사진을 선택해주세요.");
  }

  const source = await loadImageSource(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("이미지 처리를 지원하지 않는 브라우저입니다.");
    }
    ctx.drawImage(source.image, 0, 0, width, height);

    let quality = INITIAL_QUALITY;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    while (dataUrl.length > MAX_OUTPUT_BASE64_LENGTH && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    return {
      base64: dataUrl.split(",")[1] ?? "",
      mediaType: "image/jpeg",
      previewUrl: dataUrl,
    };
  } finally {
    source.release();
  }
}

async function loadImageSource(file: File): Promise<ImageSource> {
  const direct = await tryCreateImageBitmap(file);
  if (direct) return direct;

  // 일부 안드로이드 기종(특히 삼성 갤럭시의 "높은 효율" 사진 저장 옵션)은 실제로는 HEIC
  // 바이트를 담고 있으면서도 파일명 확장자와 MIME 타입을 .jpg / image/jpeg로 잘못 표기해
  // 넘겨준다. 그래서 확장자나 타입과 무관하게 일단 HEIC 변환을 한번 시도해본다.
  const converted = await tryConvertHeic(file);
  if (converted) {
    const viaConverted = await tryCreateImageBitmap(converted);
    if (viaConverted) return viaConverted;
  }

  return await loadViaImgElement(file);
}

async function tryCreateImageBitmap(blob: Blob): Promise<ImageSource | null> {
  if (typeof createImageBitmap !== "function") return null;
  try {
    const bitmap = await createImageBitmap(blob);
    return {
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  } catch {
    return null;
  }
}

async function tryConvertHeic(file: File): Promise<Blob | null> {
  try {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
    return Array.isArray(result) ? result[0] : result;
  } catch {
    // 실제로는 HEIC가 아니었거나 변환기가 지원하지 못하는 경우. 아래 폴백으로 넘어간다.
    return null;
  }
}

async function loadViaImgElement(file: File): Promise<ImageSource> {
  try {
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
    return {
      image: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => {},
    };
  } catch (err) {
    // createImageBitmap, HEIC 변환, <img> 디코딩까지 모두 실패했다면 브라우저가 지원하지
    // 않는 포맷일 가능성이 높다. HEIC로 추정되면 구체적으로 안내한다.
    if (looksLikeHeic(file)) {
      throw new Error(
        "HEIC/HEIF 형식의 사진을 처리하지 못했습니다. 사진 앱에서 JPEG로 저장한 뒤 다시 시도해주세요."
      );
    }
    throw err;
  }
}
