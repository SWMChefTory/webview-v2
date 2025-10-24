// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ⬇️ 정적 내보내기 (Next 13.4+)
  output: "export",
  // ⬇️ next/image 최적화 서버를 쓰지 않도록 (정적 호스팅용)
  images: {
    unoptimized: true,
  },
  // (선택) 폴더형 URL을 원하면 켜기: /about → /about/index.html
  // trailingSlash: true,
  eslint: {
    // ✅ ESLint 에러가 있어도 빌드 계속 진행
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;