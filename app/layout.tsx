import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "나의 포트폴리오", template: "%s | 나의 포트폴리오" },
  description: "수상 경력, 자격증, 관심사, 내가 만든 작품을 모아 둔 포트폴리오",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F9FF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard: 화면에 쓰인 글자만 내려받는 dynamic subset 버전 */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 키보드(Tab)로 들어오면 가장 먼저 보이는 링크: 메뉴를 건너뛰고 본문으로 */}
        <a
          href="#main"
          className="sr-only z-50 rounded-xl bg-ink px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
