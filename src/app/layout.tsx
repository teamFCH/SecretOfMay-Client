import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오월의 비밀을 풀어라",
  description: "1980년 5월, 광주의 기록을 복원하십시오.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
