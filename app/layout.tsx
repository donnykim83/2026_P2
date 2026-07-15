import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "관상은 과학이다",
  description: "사진을 업로드하면 Claude가 관상을 풀이해드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
