import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamRadar — 팀플 리스크 분석",
  description: "팀원별 기여도 및 리스크 분석 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
