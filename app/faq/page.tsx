import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "자주 묻는 질문 — 관상은 과학이다",
  description: "사진 처리 방식, 정확도, 이용 방법 등 자주 묻는 질문에 답합니다.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "업로드한 사진은 저장되나요?",
    a: "아니요. 업로드된 사진은 해석을 생성하는 요청 처리 중에만 사용되고, 응답이 반환된 직후 폐기됩니다. 서버 데이터베이스나 파일 저장소에 별도로 보관하지 않습니다.",
  },
  {
    q: "결과가 과학적으로 정확한가요?",
    a: "아니요. 관상학은 현대 과학으로 검증된 이론이 아닌 전통적 해석 체계이며, 이 서비스는 오락 목적으로 제공됩니다. 실제 성격이나 미래를 예측하는 도구로 사용하지 마세요.",
  },
  {
    q: "어떤 사진 형식을 지원하나요?",
    a: "JPEG, PNG, GIF, WEBP 형식을 지원하며, 원활한 처리를 위해 업로드 전 브라우저에서 자동으로 크기를 줄입니다. 아이폰의 HEIC/HEIF 사진은 브라우저에 따라 열리지 않을 수 있는데, 이 경우 아이폰 설정 > 카메라 > 포맷에서 '높은 호환성'을 선택하거나 사진 앱에서 JPEG로 저장한 뒤 다시 시도해주세요.",
  },
  {
    q: "이용 요금이 있나요?",
    a: "현재는 별도 이용 요금 없이 무료로 제공됩니다. 서비스 운영 방식은 추후 변경될 수 있습니다.",
  },
  {
    q: "얼굴이 잘 나오지 않은 사진도 되나요?",
    a: "인물의 얼굴이 뚜렷하게 보이는 사진일수록 더 자연스러운 결과를 받을 수 있습니다. 얼굴이 가려지거나 인물이 없는 사진은 원하는 결과가 나오지 않을 수 있습니다.",
  },
  {
    q: "동일한 사진으로 여러 번 요청할 수 있나요?",
    a: "서비스 안정성과 남용 방지를 위해 짧은 시간 동안 반복 요청 시 제한이 걸릴 수 있습니다. 제한에 걸리면 안내 메시지에 따라 잠시 후 다시 시도해주세요.",
  },
];

export default function FaqPage() {
  return (
    <main className="static-page">
      <div className="header">
        <h1>자주 묻는 질문</h1>
        <p>궁금한 점을 먼저 확인해보세요</p>
      </div>

      <section className="static-section">
        <dl className="faq-list">
          {FAQS.map((item) => (
            <div className="faq-item" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="static-back">
        <Link href="/">← 메인으로 돌아가기</Link>
      </p>
    </main>
  );
}
