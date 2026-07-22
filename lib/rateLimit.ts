// 인메모리 슬라이딩 윈도우 방식의 간단한 요청 제한기.
// 서버리스 인스턴스별로 상태가 분리되고 콜드스타트 시 초기화되므로 완벽한 방어는 아니지만,
// 별도 인프라(Redis 등) 없이 API 남용으로 인한 Claude 비용 폭증을 1차로 막는 용도.
type Window = { timestamps: number[] };

const store = new Map<string, Window>();

const SHORT_WINDOW_MS = 10 * 60 * 1000; // 10분
const SHORT_WINDOW_MAX = 5; // 10분당 최대 5회

const LONG_WINDOW_MS = 24 * 60 * 60 * 1000; // 24시간
const LONG_WINDOW_MAX = 20; // 하루 최대 20회

const MAX_TRACKED_KEYS = 5000; // 메모리 누수 방지용 상한

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  if (store.size > MAX_TRACKED_KEYS) {
    for (const [k, w] of store) {
      const recent = w.timestamps.filter((t) => now - t < LONG_WINDOW_MS);
      if (recent.length === 0) store.delete(k);
    }
  }

  const entry = store.get(key) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < LONG_WINDOW_MS);

  const inShortWindow = entry.timestamps.filter((t) => now - t < SHORT_WINDOW_MS);
  const inLongWindow = entry.timestamps;

  if (inShortWindow.length >= SHORT_WINDOW_MAX) {
    const oldest = Math.min(...inShortWindow);
    store.set(key, entry);
    return { allowed: false, retryAfterSeconds: Math.ceil((SHORT_WINDOW_MS - (now - oldest)) / 1000) };
  }
  if (inLongWindow.length >= LONG_WINDOW_MAX) {
    const oldest = Math.min(...inLongWindow);
    store.set(key, entry);
    return { allowed: false, retryAfterSeconds: Math.ceil((LONG_WINDOW_MS - (now - oldest)) / 1000) };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true };
}

export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
