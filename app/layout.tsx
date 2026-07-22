import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "관상은 과학이다",
  description: "사진을 업로드하면 Claude가 관상을 풀이해드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <footer className="site-footer">
          <Link href="/about">관상학 소개</Link>
          <span aria-hidden="true">·</span>
          <Link href="/faq">자주 묻는 질문</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy">개인정보처리방침</Link>
        </footer>
      </body>
    </html>
  );
}
