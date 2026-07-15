# 관상은 과학이다

사진을 업로드하면 Claude Vision API가 관상(얼굴 기반 해석)을 풀이해주는 웹앱입니다.
결과는 오락 목적이며 과학적으로 검증된 내용이 아닙니다.

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # ANTHROPIC_API_KEY 값 채우기
npm run dev
```

http://localhost:3000 접속

## 배포 (Vercel)

1. GitHub 저장소를 Vercel에 연결
2. 프로젝트 환경변수에 `ANTHROPIC_API_KEY` 등록
3. Deploy

## 구조

- `app/page.tsx` — 업로드/톤 선택/결과 표시 UI
- `app/api/analyze/route.ts` — 이미지+톤을 받아 Claude 호출 후 결과 반환
- `lib/anthropic.ts` — Anthropic 클라이언트, 톤별 system prompt
- `components/` — PhotoUploader, ToneSelector, ResultView

업로드된 사진은 서버에 저장되지 않고 요청 처리 후 즉시 폐기됩니다.
