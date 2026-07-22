import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "관상학이란? — 관상은 과학이다",
  description: "전통 관상학의 개념과 이 서비스가 결과를 만들어내는 방식을 소개합니다.",
};

export default function AboutPage() {
  return (
    <main className="static-page">
      <div className="header">
        <h1>관상학이란?</h1>
        <p>전통 이론과 이 서비스의 동작 방식을 소개합니다</p>
      </div>

      <section className="static-section">
        <h2>관상학의 전통 개념</h2>
        <p>
          관상학(觀相學)은 얼굴의 생김새를 통해 성격과 기질을 유추해보던 동아시아의 오래된
          해석 전통입니다. 오늘날에는 과학적으로 검증된 학문이 아니라, 문화적 유산이자
          오락적 해석 체계로 받아들여집니다. 대표적으로 다음과 같은 개념들이 쓰입니다.
        </p>
        <ul>
          <li>
            <strong>삼정(三停)</strong> — 얼굴을 이마(상정), 코(중정), 턱(하정) 세 구간으로
            나누어 초년·중년·말년 운을 비유적으로 이야기하는 방식입니다.
          </li>
          <li>
            <strong>오악(五嶽)</strong> — 이마, 코, 좌우 광대뼈, 턱을 산에 비유해 얼굴의
            전체적인 균형과 인상을 설명하는 전통적 틀입니다.
          </li>
          <li>
            <strong>오관(五官)</strong> — 눈썹, 눈, 코, 입, 귀 다섯 부위 각각에 상징적인
            의미를 부여해 해석하는 방식입니다.
          </li>
        </ul>
      </section>

      <section className="static-section">
        <h2>이 서비스는 어떻게 동작하나요?</h2>
        <p>
          사용자가 업로드한 사진을 Anthropic의 Claude(비전 모델)에게 전달하고, 위에서 소개한
          전통 관상학 용어를 인용하며 해석하도록 미리 정해진 지침을 줍니다. 톤은 두 가지 중
          선택할 수 있습니다.
        </p>
        <ul>
          <li><strong>재미있게</strong> — 가볍고 유쾌한 어조로 풀이합니다.</li>
          <li><strong>전통적으로</strong> — 삼정·오악·오관 등 이론 체계를 인용해 조금 더
            학술적인 어조로 풀이합니다.</li>
        </ul>
        <p>
          업로드한 사진은 해석을 생성하는 동안에만 처리되며 서버에 저장하지 않습니다. 자세한
          내용은 <Link href="/privacy">개인정보처리방침</Link>을 참고해주세요.
        </p>
      </section>

      <section className="static-section">
        <h2>결과를 어떻게 받아들여야 하나요?</h2>
        <p>
          이 서비스가 제공하는 모든 해석은 오락 목적의 콘텐츠입니다. 사람의 성격, 능력,
          운명은 얼굴만으로 판단할 수 없으며, 과학적으로 검증된 사실이 아닙니다. 재미로
          가볍게 즐겨주세요.
        </p>
      </section>

      <p className="static-back">
        <Link href="/">← 메인으로 돌아가기</Link>
      </p>
    </main>
  );
}
