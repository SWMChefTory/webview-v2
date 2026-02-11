import type { NextConfig } from "next";
import i18nConfig from "./next-i18next.config";
import withBundleAnalyzer from '@next/bundle-analyzer'
import packageJson from "./package.json";

const { i18n } = i18nConfig;

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: true,
//   openAnalyzer: true,
// });


const nextConfig: NextConfig = {
  // eslint: {
  //   //temp option
  //   ignoreDuringBuilds: true,
  // },
  i18n,
  typescript: {
    //temp option
    ignoreBuildErrors: true,
  },

  /* config options here */
  // reactStrictMode: true,

  // Docker 배포를 위한 standalone 출력 설정
  output: 'standalone',

  // package.json의 버전을 환경변수로 주입
  env: {
    NEXT_PUBLIC_WEB_VERSION: packageJson.version,
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  // openAnalyzer: true // default!
})(nextConfig)



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   output: "export",
  
//   images: {
//     unoptimized: true,
//   },
  
//   eslint: {
    
//     ignoreDuringBuilds: true,
//   },

// };

// export default nextConfig;