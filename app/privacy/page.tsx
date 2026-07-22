import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 관상은 과학이다",
  description: "수집하는 정보, 처리 방식, 제3자 제공 및 광고 관련 안내입니다.",
};

const LAST_UPDATED = "2026-07-17";
const CONTACT_EMAIL = "donnykim83@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="static-page">
      <div className="header">
        <h1>개인정보처리방침</h1>
        <p>최종 수정일: {LAST_UPDATED}</p>
      </div>

      <section className="static-section">
        <h2>1. 수집하는 정보</h2>
        <p>
          이 서비스는 관상 해석을 생성하기 위해 사용자가 업로드한 사진과 선택한 톤(재미있게 /
          전통적으로) 정보를 서버로 전송받습니다. 별도의 회원가입이나 로그인 절차는 없으며,
          이름·연락처 등 개인 식별 정보를 직접 수집하지 않습니다.
        </p>
      </section>

      <section className="static-section">
        <h2>2. 사진 처리 및 보관</h2>
        <p>
          업로드된 사진은 해석 결과를 생성하는 요청을 처리하는 동안에만 사용되며, 응답이
          반환된 후 서버에 저장하지 않고 즉시 폐기합니다. 별도의 데이터베이스나 파일
          저장소에 사진을 보관하지 않습니다.
        </p>
      </section>

      <section className="static-section">
        <h2>3. 제3자 제공 (AI 처리 위탁)</h2>
        <p>
          관상 해석 생성을 위해 업로드된 사진과 요청 내용을 미국 Anthropic, PBC의 Claude
          API로 전송합니다. 이 과정은 해석 결과를 생성하기 위한 목적으로만 사용되며,
          Anthropic의 API 이용 정책에 따라 처리됩니다. 이 사이트는 Vercel을 통해
          호스팅됩니다.
        </p>
      </section>

      <section className="static-section">
        <h2>4. 광고 및 쿠키</h2>
        <p>
          이 사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google을 포함한
          제3자 광고 제공업체는 쿠키를 사용해 사용자의 이전 방문 기록을 기반으로 맞춤형
          광고를 표시할 수 있습니다. 맞춤형 광고 게재를 원하지 않는 경우{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer noopener">
            Google 광고 설정
          </a>{" "}
          페이지에서 선택 해제할 수 있습니다.
        </p>
      </section>

      <section className="static-section">
        <h2>5. 이용자 권리</h2>
        <p>
          이 서비스는 사진을 저장하지 않으므로 별도의 열람·삭제 요청이 필요하지 않습니다.
          그 외 개인정보 처리와 관련해 문의하실 사항이 있다면 아래 연락처로 문의해주세요.
        </p>
      </section>

      <section className="static-section">
        <h2>6. 문의</h2>
        <p>{CONTACT_EMAIL}</p>
      </section>

      <p className="static-back">
        <Link href="/">← 메인으로 돌아가기</Link>
      </p>
    </main>
  );
}
