// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://meongtime.com"),
  title: {
    default: "멍타임 (MeongTime) | 심심할 때 가볍게 즐기는 웹 게임",
    template: "%s | 멍타임",
  },
  description: "설치 없이 링크만 누르면 바로 플레이 가능한 킬링타임 미니 웹 게임 포털",
  keywords: ["웹게임", "미니게임", "멍타임", "반응속도", "퀴즈", "킬링타임"],
  openGraph: {
    title: "멍타임 (MeongTime)",
    description: "설치 없이 링크로 바로 즐기는 미니 웹 게임 모음",
    url: "https://meongtime.com",
    siteName: "멍타임",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-yellow-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}