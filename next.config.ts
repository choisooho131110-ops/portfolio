import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Supabase Storage의 portfolio-images 버킷 사진만 next/image로 보여줄 수 있게
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/portfolio-images/**",
      },
    ],
  },
  // 작품 HTML 파일들은 아이콘을 따로 정하지 않아서 브라우저가 /favicon.ico 를 찾아요 → 게임패드 아이콘으로 연결
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
