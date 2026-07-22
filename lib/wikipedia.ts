const FETCH_TIMEOUT_MS = 5000;

export type ActorPhoto = {
  imageUrl: string;
  pageUrl: string;
  title: string;
};

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function searchTitle(lang: string, query: string): Promise<string | null> {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(query)}`;
  const data = await fetchJson(url);
  return data?.query?.search?.[0]?.title ?? null;
}

async function fetchSummary(lang: string, title: string): Promise<ActorPhoto | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = await fetchJson(url);
  if (!data || data.type === "disambiguation") return null;
  const imageUrl: string | undefined = data.thumbnail?.source ?? data.originalimage?.source;
  if (!imageUrl) return null;
  return {
    imageUrl,
    pageUrl: data.content_urls?.desktop?.page ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    title: data.title ?? title,
  };
}

async function lookup(lang: string, query: string): Promise<ActorPhoto | null> {
  const direct = await fetchSummary(lang, query);
  if (direct) return direct;
  const foundTitle = await searchTitle(lang, query);
  if (!foundTitle) return null;
  return fetchSummary(lang, foundTitle);
}

// 여러 언어/이름 후보로 순서대로 시도해 배우의 위키피디아 썸네일 사진을 찾는다.
// (한국 위키 직접 조회 -> 영문 이름으로 영문 위키 조회 -> 한글 이름으로 영문 위키 검색 순)
export async function findActorPhoto(name: string, nameEn?: string): Promise<ActorPhoto | null> {
  const queries: Array<{ lang: string; query: string }> = [{ lang: "ko", query: name }];
  if (nameEn && nameEn !== name) {
    queries.push({ lang: "en", query: nameEn });
  }
  queries.push({ lang: "en", query: name });

  for (const q of queries) {
    const result = await lookup(q.lang, q.query);
    if (result) return result;
  }
  return null;
}
